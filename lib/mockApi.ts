/**
 * In-browser mock backend for InvBank.
 *
 * Purpose: let the UI be tested end-to-end without a running Quart backend,
 * without Supabase, without Resend, without any network.
 *
 * Activation (any of):
 *   1. env: NEXT_PUBLIC_USE_MOCK=1
 *   2. runtime: localStorage.setItem("invbank_mock", "1") then reload
 *   3. auto-fallback: if the real fetch throws a NETWORK error
 *      (TypeError / "Failed to fetch") and NEXT_PUBLIC_MOCK_FALLBACK=1,
 *      we switch to mock mode for the rest of the session.
 *
 * All mock data is persisted in localStorage under "invbank_mock_db" so it
 * survives reloads. Call `resetMockDb()` from the console to wipe it.
 *
 * The handler mirrors the real backend's endpoint surface (`lib/api.ts`).
 */

// ─── Types ────────────────────────────────────────────────────────────────
interface MockResponse<T = any> {
	data?: T;
	error?: string;
	message?: string;
}

interface MockDb {
	users: Record<string, any>;       // email → user row (with password_hash)
	currentUserId: string | null;
	accounts: any[];
	transactions: any[];
	transfers: any[];
	cards: any[];
	bills: any[];
	billPayments: any[];
	checks: any[];
	notifications: any[];
	beneficiaries: any[];
}

// ─── Activation ───────────────────────────────────────────────────────────
let sessionFallbackActive = false;

export function isMockModeEnabled(): boolean {
	if (typeof window === "undefined") return false;
	if (process.env.NEXT_PUBLIC_USE_MOCK === "1") return true;
	if (sessionFallbackActive) return true;
	try {
		return localStorage.getItem("invbank_mock") === "1";
	} catch {
		return false;
	}
}

export function enableMockFallback() {
	sessionFallbackActive = true;
	if (typeof window !== "undefined") {
		console.warn(
			"[InvBank] Real backend unreachable — switching to MOCK mode for this session. " +
				"Set NEXT_PUBLIC_USE_MOCK=1 to make this the default.",
		);
	}
}

export function shouldAutoFallback(): boolean {
	return process.env.NEXT_PUBLIC_MOCK_FALLBACK === "1";
}

// ─── DB persistence ───────────────────────────────────────────────────────
const DB_KEY = "invbank_mock_db";

function seedDb(): MockDb {
	const now = new Date().toISOString();
	const userId = "user_demo";
	return {
		users: {
			"demo@invbank.us": {
				id: userId,
				email: "demo@invbank.us",
				password: "password123", // plaintext — MOCK ONLY
				full_name: "Demo User",
				phone: "+1 (555) 000-0100",
				preferred_brand: "Everyday",
				transaction_pin: "123456",
				role: "user",
				account_status: "active",
				transactions_blocked: false,
				created_at: now,
			},
			"admin@invbank.us": {
				id: "user_admin",
				email: "admin@invbank.us",
				password: "admin123",
				full_name: "Admin User",
				phone: "+1 (555) 000-0200",
				preferred_brand: "Wealth",
				transaction_pin: "000000",
				role: "admin",
				account_status: "active",
				transactions_blocked: false,
				created_at: now,
			},
		},
		currentUserId: null,
		accounts: [
			{
				id: "acc_checking",
				user_id: userId,
				account_number: "**** 4521",
				account_type: "Everyday Checking",
				balance: 12450.32,
				currency: "USD",
				status: "active",
				routing_number: "021000089",
				created_at: now,
			},
			{
				id: "acc_savings",
				user_id: userId,
				account_number: "**** 8890",
				account_type: "High-Yield Savings",
				balance: 48230.11,
				currency: "USD",
				status: "active",
				routing_number: "021000089",
				created_at: now,
			},
			{
				id: "acc_invest",
				user_id: userId,
				account_number: "**** 1074",
				account_type: "Invest & Trade",
				balance: 23105.88,
				currency: "USD",
				status: "active",
				routing_number: "021000089",
				created_at: now,
			},
		],
		transactions: [
			{ id: "tx_1", account_id: "acc_checking", type: "debit",  amount: 42.18, description: "Whole Foods",          merchant: "Whole Foods Market", category: "Groceries", created_at: new Date(Date.now() - 3600_000).toISOString() },
			{ id: "tx_2", account_id: "acc_checking", type: "credit", amount: 2850.00, description: "Payroll — Acme Corp", merchant: "Acme Corp",          category: "Income",     created_at: new Date(Date.now() - 86_400_000).toISOString() },
			{ id: "tx_3", account_id: "acc_checking", type: "debit",  amount: 14.99, description: "Netflix",              merchant: "Netflix",            category: "Subscriptions", created_at: new Date(Date.now() - 2 * 86_400_000).toISOString() },
			{ id: "tx_4", account_id: "acc_savings",  type: "credit", amount: 180.23, description: "Interest",             merchant: "InvBank",           category: "Interest",   created_at: new Date(Date.now() - 3 * 86_400_000).toISOString() },
			{ id: "tx_5", account_id: "acc_checking", type: "debit",  amount: 89.50, description: "Con Edison utilities",  merchant: "ConEd",              category: "Utilities",  created_at: new Date(Date.now() - 4 * 86_400_000).toISOString() },
			{ id: "tx_6", account_id: "acc_invest",   type: "debit",  amount: 500.00, description: "Bought AAPL",          merchant: "InvBank Trading",   category: "Investing",  created_at: new Date(Date.now() - 5 * 86_400_000).toISOString() },
		],
		transfers: [],
		cards: [
			{ id: "card_1", user_id: userId, card_number: "**** **** **** 4521", card_type: "debit",  card_brand: "Visa",       status: "active", created_at: now },
			{ id: "card_2", user_id: userId, card_number: "**** **** **** 9933", card_type: "credit", card_brand: "Mastercard", credit_limit: 15000, balance: 1234.22, status: "active", created_at: now },
		],
		bills: [
			{ id: "bill_1", user_id: userId, payee_name: "Con Edison",    bill_type: "Utilities", amount: 89.50,  due_date: new Date(Date.now() + 7 * 86_400_000).toISOString(),  auto_pay: true,  created_at: now },
			{ id: "bill_2", user_id: userId, payee_name: "Verizon",       bill_type: "Phone",     amount: 65.00,  due_date: new Date(Date.now() + 12 * 86_400_000).toISOString(), auto_pay: false, created_at: now },
			{ id: "bill_3", user_id: userId, payee_name: "Chase Sapphire", bill_type: "Credit Card", amount: 430.21, due_date: new Date(Date.now() + 21 * 86_400_000).toISOString(), auto_pay: false, created_at: now },
		],
		billPayments: [],
		checks: [],
		notifications: [
			{ id: "n_1", user_id: userId, type: "security", title: "New sign-in detected", message: "A new sign-in from Chrome on macOS was detected.",       read: false, created_at: new Date(Date.now() - 1800_000).toISOString() },
			{ id: "n_2", user_id: userId, type: "transaction", title: "Deposit received",   message: "Your payroll of $2,850.00 was deposited.",              read: false, created_at: new Date(Date.now() - 86_400_000).toISOString() },
			{ id: "n_3", user_id: userId, type: "promo",      title: "Welcome to InvBank",  message: "Set up direct deposit to unlock fee-free overdraft.", read: true,  created_at: new Date(Date.now() - 3 * 86_400_000).toISOString() },
		],
		beneficiaries: [],
	};
}

function loadDb(): MockDb {
	if (typeof window === "undefined") return seedDb();
	try {
		const raw = localStorage.getItem(DB_KEY);
		if (raw) return JSON.parse(raw) as MockDb;
	} catch {}
	const fresh = seedDb();
	saveDb(fresh);
	return fresh;
}

function saveDb(db: MockDb) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(DB_KEY, JSON.stringify(db));
	} catch {}
}

export function resetMockDb() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(DB_KEY);
	localStorage.removeItem("auth_token");
	console.info("[InvBank] Mock DB reset.");
}

// Expose on window for dev convenience
if (typeof window !== "undefined") {
	(window as any).invbankMock = {
		reset: resetMockDb,
		enable: () => { localStorage.setItem("invbank_mock", "1"); location.reload(); },
		disable: () => { localStorage.removeItem("invbank_mock"); location.reload(); },
		db: loadDb,
	};
}

// ─── Utilities ────────────────────────────────────────────────────────────
const TOKEN_PREFIX = "mock_tok_";

function randomId(prefix: string): string {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function tokenForUser(userId: string): string {
	return `${TOKEN_PREFIX}${userId}`;
}

function userIdFromToken(token: string | null): string | null {
	if (!token || !token.startsWith(TOKEN_PREFIX)) return null;
	return token.slice(TOKEN_PREFIX.length);
}

function getCurrentUser(db: MockDb, token: string | null): any | null {
	const userId = userIdFromToken(token);
	if (!userId) return null;
	return Object.values(db.users).find((u: any) => u.id === userId) || null;
}

function stripSensitive(user: any) {
	if (!user) return user;
	const { password, transaction_pin, ...safe } = user;
	return safe;
}

function ok<T>(data: T): MockResponse<T> { return { data }; }
function err(msg: string): MockResponse { return { error: msg }; }

function parseBody(options: RequestInit): any {
	if (!options.body) return {};
	try { return JSON.parse(options.body as string); } catch { return {}; }
}

// Simulate network latency so the UI shows proper loading states.
function delay(ms = 220): Promise<void> {
	return new Promise((r) => setTimeout(r, ms));
}

// ─── Handler ──────────────────────────────────────────────────────────────
/**
 * Route a single request to the in-browser mock.
 * Returns null if this endpoint isn't handled (caller falls back to network).
 */
export async function handleMock(
	endpoint: string,
	options: RequestInit = {},
	token: string | null,
): Promise<MockResponse | null> {
	await delay();

	const method = (options.method || "GET").toUpperCase();
	const db = loadDb();
	const body = parseBody(options);
	const me = getCurrentUser(db, token);

	// Strip query string for matching but keep for params
	const [path] = endpoint.split("?");

	// ─── AUTH ────────────────────────────────────────────────────────────
	if (path === "/api/auth/register" && method === "POST") {
		if (db.users[body.email]) return err("An account with this email already exists");
		if (!body.password || body.password.length < 8) return err("Password must be at least 8 characters");
		const newUser = {
			id: randomId("user"),
			email: body.email,
			password: body.password,
			full_name: body.full_name,
			phone: body.phone || "",
			preferred_brand: body.preferred_brand || "Everyday",
			transaction_pin: body.transaction_pin,
			role: "user" as const,
			account_status: "active" as const,
			transactions_blocked: false,
			created_at: new Date().toISOString(),
		};
		db.users[body.email] = newUser;
		db.currentUserId = newUser.id;

		// Seed a starter checking account for the new user
		db.accounts.push({
			id: randomId("acc"),
			user_id: newUser.id,
			account_number: "**** " + String(Math.floor(1000 + Math.random() * 8999)),
			account_type: body.preferred_brand || "Everyday Checking",
			balance: 100.0, // welcome bonus
			currency: "USD",
			status: "active",
			routing_number: "021000089",
			created_at: new Date().toISOString(),
		});
		saveDb(db);
		const safe = stripSensitive(newUser);
		return ok({ ...safe, token: tokenForUser(newUser.id) });
	}

	if (path === "/api/auth/login" && method === "POST") {
		const u = db.users[body.email];
		if (!u || u.password !== body.password) return err("Invalid email or password");
		db.currentUserId = u.id;
		saveDb(db);
		const safe = stripSensitive(u);
		return ok({ ...safe, token: tokenForUser(u.id) });
	}

	if (path === "/api/auth/logout" && method === "POST") {
		db.currentUserId = null;
		saveDb(db);
		return ok({ message: "Logged out" });
	}

	if (path === "/api/auth/me") {
		if (!me) return err("Not authenticated");
		return ok(stripSensitive(me));
	}

	if (path === "/api/auth/set-pin" && method === "POST") {
		if (!me) return err("Not authenticated");
		me.transaction_pin = body.transaction_pin;
		saveDb(db);
		return ok({ message: "PIN updated" });
	}

	// Guard everything below behind auth
	const needsAuth =
		path.startsWith("/api/accounts") ||
		path.startsWith("/api/transactions") ||
		path.startsWith("/api/transfers") ||
		path.startsWith("/api/cards") ||
		path.startsWith("/api/bills") ||
		path.startsWith("/api/checks") ||
		path.startsWith("/api/notifications") ||
		path.startsWith("/api/settings") ||
		path.startsWith("/api/beneficiaries") ||
		path.startsWith("/api/concierge") ||
		path.startsWith("/api/admin") ||
		path.startsWith("/api/search");
	if (needsAuth && !me) return err("Not authenticated");

	// ─── ACCOUNTS ────────────────────────────────────────────────────────
	if (path === "/api/accounts" && method === "GET") {
		return ok(db.accounts.filter((a) => a.user_id === me!.id));
	}
	if (path === "/api/accounts" && method === "POST") {
		const acc = {
			id: randomId("acc"),
			user_id: me!.id,
			account_number: "**** " + String(Math.floor(1000 + Math.random() * 8999)),
			account_type: body.account_type || "Everyday Checking",
			balance: 0,
			currency: "USD",
			status: "active",
			routing_number: "021000089",
			created_at: new Date().toISOString(),
		};
		db.accounts.push(acc);
		saveDb(db);
		return ok(acc);
	}
	const accTxMatch = path.match(/^\/api\/accounts\/([^/]+)\/transactions$/);
	if (accTxMatch && method === "GET") {
		const accountId = accTxMatch[1];
		return ok(db.transactions.filter((t) => t.account_id === accountId));
	}

	// ─── TRANSFERS ───────────────────────────────────────────────────────
	if (path === "/api/transfers" && method === "GET") {
		return ok(db.transfers);
	}
	if (path === "/api/transfers" && method === "POST") {
		if (body.pin !== me!.transaction_pin) return err("Invalid transaction PIN");
		const from = db.accounts.find((a) => a.id === body.from_account_id && a.user_id === me!.id);
		if (!from) return err("Source account not found");
		if (from.balance < body.amount) return err("Insufficient funds");
		from.balance -= body.amount;
		const to = body.to_account_id ? db.accounts.find((a) => a.id === body.to_account_id) : null;
		if (to) to.balance += body.amount;
		const transfer = {
			id: randomId("tx"),
			user_id: me!.id,
			from_account_id: body.from_account_id,
			to_account_id: body.to_account_id,
			to_external: body.to_external,
			amount: body.amount,
			transfer_type: body.transfer_type || "internal",
			status: "completed",
			created_at: new Date().toISOString(),
		};
		db.transfers.push(transfer);
		db.transactions.push({
			id: randomId("tx"),
			account_id: from.id,
			type: "debit",
			amount: body.amount,
			description: `Transfer${body.to_external?.name ? ` to ${body.to_external.name}` : ""}`,
			category: "Transfer",
			created_at: transfer.created_at,
		});
		saveDb(db);
		return ok(transfer);
	}

	// ─── CARDS ───────────────────────────────────────────────────────────
	if (path === "/api/cards" && method === "GET") return ok(db.cards.filter((c) => c.user_id === me!.id));
	if (path === "/api/cards/apply" && method === "POST") {
		const card = {
			id: randomId("card"),
			user_id: me!.id,
			card_number: "**** **** **** " + String(Math.floor(1000 + Math.random() * 8999)),
			card_type: body.card_type || "debit",
			card_brand: body.card_brand || "Visa",
			credit_limit: body.credit_limit,
			balance: 0,
			status: "approved" as const,
			created_at: new Date().toISOString(),
		};
		db.cards.push(card);
		saveDb(db);
		return ok(card);
	}
	const cardLockMatch = path.match(/^\/api\/cards\/([^/]+)\/lock$/);
	if (cardLockMatch && method === "POST") {
		const card = db.cards.find((c) => c.id === cardLockMatch[1]);
		if (!card) return err("Card not found");
		card.status = body.locked ? "locked" : "active";
		saveDb(db);
		return ok(card);
	}
	const cardIssueMatch = path.match(/^\/api\/cards\/([^/]+)\/report-issue$/);
	if (cardIssueMatch && method === "POST") {
		const card = db.cards.find((c) => c.id === cardIssueMatch[1]);
		if (!card) return err("Card not found");
		card.status = "reported";
		saveDb(db);
		return ok(card);
	}

	// ─── BILLS ───────────────────────────────────────────────────────────
	if (path === "/api/bills" && method === "GET") return ok(db.bills.filter((b) => b.user_id === me!.id));
	if (path === "/api/bills" && method === "POST") {
		const bill = {
			id: randomId("bill"),
			user_id: me!.id,
			payee_name: body.payee_name,
			account_number: body.account_number,
			bill_type: body.bill_type,
			amount: body.amount,
			due_date: body.due_date,
			auto_pay: !!body.auto_pay,
			created_at: new Date().toISOString(),
		};
		db.bills.push(bill);
		saveDb(db);
		return ok(bill);
	}
	const billPayMatch = path.match(/^\/api\/bills\/([^/]+)\/pay$/);
	if (billPayMatch && method === "POST") {
		if (body.pin !== me!.transaction_pin) return err("Invalid transaction PIN");
		const bill = db.bills.find((b) => b.id === billPayMatch[1]);
		if (!bill) return err("Bill not found");
		const acc = db.accounts.find((a) => a.id === body.account_id && a.user_id === me!.id);
		if (!acc) return err("Source account not found");
		if (acc.balance < body.amount) return err("Insufficient funds");
		acc.balance -= body.amount;
		const payment = {
			id: randomId("pay"),
			user_id: me!.id,
			bill_id: bill.id,
			account_id: acc.id,
			amount: body.amount,
			payment_date: body.payment_date || new Date().toISOString(),
			status: "completed",
			created_at: new Date().toISOString(),
		};
		db.billPayments.push(payment);
		db.transactions.push({
			id: randomId("tx"),
			account_id: acc.id,
			type: "debit",
			amount: body.amount,
			description: `Bill pay — ${bill.payee_name}`,
			category: "Bills",
			created_at: payment.created_at,
		});
		saveDb(db);
		return ok(payment);
	}

	// ─── CHECKS ──────────────────────────────────────────────────────────
	if (path === "/api/checks" && method === "GET") return ok(db.checks.filter((c) => c.user_id === me!.id));
	if (path === "/api/checks/deposit" && method === "POST") {
		if (body.pin !== me!.transaction_pin) return err("Invalid transaction PIN");
		const acc = db.accounts.find((a) => a.id === body.account_id && a.user_id === me!.id);
		if (!acc) return err("Account not found");
		acc.balance += body.amount;
		const check = {
			id: randomId("chk"),
			user_id: me!.id,
			account_id: acc.id,
			check_number: body.check_number,
			amount: body.amount,
			status: "pending",
			created_at: new Date().toISOString(),
		};
		db.checks.push(check);
		db.transactions.push({
			id: randomId("tx"),
			account_id: acc.id,
			type: "credit",
			amount: body.amount,
			description: "Mobile check deposit",
			category: "Deposit",
			created_at: check.created_at,
		});
		saveDb(db);
		return ok(check);
	}
	if (path === "/api/checks/order" && method === "POST") {
		const order = {
			id: randomId("chk_ord"),
			user_id: me!.id,
			account_id: body.account_id,
			design: body.design || "Classic Navy",
			quantity: body.quantity || 50,
			price: body.price || 12.99,
			status: "ordered",
			created_at: new Date().toISOString(),
		};
		saveDb(db);
		return ok(order);
	}

	// ─── NOTIFICATIONS ───────────────────────────────────────────────────
	if (path === "/api/notifications" && method === "GET") {
		return ok(db.notifications.filter((n) => n.user_id === me!.id));
	}
	const notifReadMatch = path.match(/^\/api\/notifications\/([^/]+)\/read$/);
	if (notifReadMatch && method === "PUT") {
		const n = db.notifications.find((x) => x.id === notifReadMatch[1]);
		if (n) n.read = true;
		saveDb(db);
		return ok(undefined as any);
	}
	if (path === "/api/notifications/mark-all-read" && method === "PUT") {
		db.notifications.forEach((n) => { if (n.user_id === me!.id) n.read = true; });
		saveDb(db);
		return ok(undefined as any);
	}

	// ─── SETTINGS ────────────────────────────────────────────────────────
	if (path === "/api/settings" && method === "GET") return ok(stripSensitive(me!));
	if (path === "/api/settings" && method === "PUT") {
		Object.assign(me!, body);
		saveDb(db);
		return ok(stripSensitive(me!));
	}

	// ─── BENEFICIARIES ───────────────────────────────────────────────────
	if (path === "/api/beneficiaries" && method === "GET") {
		return ok(db.beneficiaries.filter((b) => b.user_id === me!.id));
	}
	if (path === "/api/beneficiaries" && method === "POST") {
		const b = { id: randomId("ben"), user_id: me!.id, ...body, created_at: new Date().toISOString() };
		db.beneficiaries.push(b);
		saveDb(db);
		return ok(b);
	}
	const benMatch = path.match(/^\/api\/beneficiaries\/([^/]+)$/);
	if (benMatch && method === "PUT") {
		const b = db.beneficiaries.find((x) => x.id === benMatch[1] && x.user_id === me!.id);
		if (!b) return err("Beneficiary not found");
		Object.assign(b, body);
		saveDb(db);
		return ok(b);
	}
	if (benMatch && method === "DELETE") {
		db.beneficiaries = db.beneficiaries.filter((x) => !(x.id === benMatch[1] && x.user_id === me!.id));
		saveDb(db);
		return ok(undefined as any);
	}

	// ─── CONCIERGE (AI assistant stub) ───────────────────────────────────
	if (path === "/api/concierge/chat" && method === "POST") {
		return ok({
			id: randomId("msg"),
			user_id: me!.id,
			message: body.message,
			response: "Thanks for your message. A specialist will follow up within 1 business day. (mock)",
			timestamp: new Date().toISOString(),
		});
	}
	if (path === "/api/concierge/request" && method === "POST") {
		return ok({ id: randomId("req"), status: "received" });
	}

	// ─── SEARCH ──────────────────────────────────────────────────────────
	if (path === "/api/search") {
		const q = (endpoint.split("?")[1] || "").split("q=")[1] || "";
		const query = decodeURIComponent(q).toLowerCase();
		const results: any[] = [];
		db.accounts.filter((a) => a.user_id === me!.id && (a.account_type.toLowerCase().includes(query) || a.account_number.includes(query)))
			.forEach((a) => results.push({ id: a.id, type: "account", title: a.account_type, subtitle: a.account_number, amount: a.balance, href: `/dashboard/accounts/${a.id}`, icon: "wallet", category: "Accounts" }));
		db.transactions.filter((t) => (t.description || "").toLowerCase().includes(query) || (t.merchant || "").toLowerCase().includes(query))
			.slice(0, 20)
			.forEach((t) => results.push({ id: t.id, type: "transaction", title: t.description || t.merchant, subtitle: t.merchant || "", amount: t.amount, date: t.created_at, href: "/dashboard/transactions", icon: "arrow-right", category: "Transactions" }));
		return ok({
			results,
			counts: {
				accounts: results.filter((r) => r.type === "account").length,
				transactions: results.filter((r) => r.type === "transaction").length,
				cards: 0, bills: 0, beneficiaries: 0, notifications: 0,
			},
			query,
		});
	}

	// ─── ADMIN (minimal stubs — lets admin UI render) ────────────────────
	if (path.startsWith("/api/admin/") && me!.role !== "admin") return err("Forbidden");
	if (path === "/api/admin/stats" && method === "GET") {
		return ok({
			total_users: Object.keys(db.users).length,
			total_accounts: db.accounts.length,
			total_balance: db.accounts.reduce((s, a) => s + a.balance, 0),
			total_bills: db.bills.length,
		});
	}
	if (path === "/api/admin/users" && method === "GET") {
		return ok(Object.values(db.users).map(stripSensitive));
	}
	if (path === "/api/admin/accounts" && method === "GET") {
		return ok(db.accounts.map((a) => {
			const owner = Object.values(db.users).find((u: any) => u.id === a.user_id) as any;
			return { ...a, users: owner ? { full_name: owner.full_name, email: owner.email } : undefined };
		}));
	}

	// Unhandled endpoint → return null so caller can try real network
	return null;
}
