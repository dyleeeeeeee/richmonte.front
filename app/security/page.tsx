import ReaderLayout from "@/components/ReaderLayout";

export default function SecurityPage() {
	return (
		<ReaderLayout title="Security & Protection" lastUpdated="January 2025">
			<section className="space-y-6">
				<p className="text-lg text-neutral-700 leading-relaxed">
					At Concierge Bank, security is paramount. As a Richemont Geneva banking institution, we apply
					the same meticulous attention to protecting your wealth that our Maisons apply to crafting
					their masterpieces. Your financial security is safeguarded by Swiss banking standards and
					cutting-edge technology.
				</p>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Swiss Banking Security</h2>
				<p className="text-neutral-700 leading-relaxed">
					Our Geneva headquarters operates under Switzerland&apos;s stringent financial regulations:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Regulated by FINMA (Swiss Financial Market Supervisory Authority)</li>
					<li>Adherence to Swiss banking secrecy and privacy laws</li>
					<li>Compliance with Basel III capital requirements</li>
					<li>Member of the Swiss Bankers Association</li>
					<li>Protected by Swiss deposit insurance schemes</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Multi-Factor Authentication</h2>
				<p className="text-neutral-700 leading-relaxed">
					Access to your account requires multiple verification factors:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Biometric authentication (fingerprint, Face ID)</li>
					<li>Time-based one-time passwords (TOTP)</li>
					<li>SMS or email verification codes</li>
					<li>Hardware security keys (FIDO2/U2F compatible)</li>
					<li>Device recognition and trusted device management</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Infrastructure Security</h2>
				<p className="text-neutral-700 leading-relaxed">
					Our technical infrastructure is built for maximum security:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Swiss-based data centers with ISO 27001 certification</li>
					<li>Redundant systems across multiple secure locations</li>
					<li>24/7 security operations center monitoring</li>
					<li>Advanced intrusion detection and prevention systems</li>
					<li>Regular penetration testing by independent security firms</li>
					<li>Air-gapped backup systems for critical data</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Fraud Prevention</h2>
				<p className="text-neutral-700 leading-relaxed">
					We employ sophisticated fraud detection mechanisms:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Real-time transaction monitoring using AI and machine learning</li>
					<li>Behavioral analysis to detect anomalous account activity</li>
					<li>Velocity checks and spending pattern analysis</li>
					<li>Geographic restrictions and travel notifications</li>
					<li>Instant alerts for suspicious transactions</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Compliance and Regulations</h2>
				<p className="text-neutral-700 leading-relaxed">
					Concierge Bank maintains strict compliance with:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Swiss Anti-Money Laundering (AML) regulations</li>
					<li>Know Your Customer (KYC) due diligence requirements</li>
					<li>FATF (Financial Action Task Force) recommendations</li>
					<li>International sanctions screening</li>
					<li>GDPR and Swiss FADP data protection laws</li>
					<li>PCI DSS Level 1 compliance for payment processing</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Client Security Best Practices</h2>
				<p className="text-neutral-700 leading-relaxed">
					We recommend these security measures for your protection:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Use strong, unique passwords and enable multi-factor authentication</li>
					<li>Never share your credentials or security codes with anyone</li>
					<li>Access your account only from secure, trusted networks</li>
					<li>Keep your devices updated with latest security patches</li>
					<li>Review your account activity regularly for unauthorized transactions</li>
					<li>Be wary of phishing emails or calls requesting sensitive information</li>
					<li>Contact us immediately if you notice suspicious activity</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Incident Response</h2>
				<p className="text-neutral-700 leading-relaxed">
					In the unlikely event of a security incident:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Our security team responds within minutes to contain threats</li>
					<li>Affected clients are notified immediately per regulatory requirements</li>
					<li>We work with Swiss authorities and international agencies as needed</li>
					<li>Full post-incident analysis and corrective measures implemented</li>
					<li>Transparent communication about the incident and resolution</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Security Audits and Certifications</h2>
				<p className="text-neutral-700 leading-relaxed">
					Concierge Bank undergoes regular independent audits:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Annual FINMA regulatory examinations</li>
					<li>SOC 2 Type II compliance audits</li>
					<li>ISO 27001 information security management certification</li>
					<li>Quarterly vulnerability assessments and penetration tests</li>
					<li>Third-party security audits by Big Four accounting firms</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Reporting Security Concerns</h2>
				<p className="text-neutral-700 leading-relaxed">
					If you notice suspicious activity or have security concerns, contact us immediately:
				</p>
				<p className="text-neutral-700 mt-4">
					<strong>24/7 Security Hotline:</strong> +41 22 123 4567<br />
					<strong>Email:</strong> security@conciergebank.com<br />
					<strong>For Emergencies:</strong> Use the &quot;Report Fraud&quot; button in your mobile app
				</p>
				<p className="text-neutral-700 leading-relaxed mt-4">
					Your security is our priority. We continuously invest in the latest security technologies
					and maintain vigilant monitoring to protect your wealth with Swiss precision.
				</p>
			</section>
		</ReaderLayout>
	);
}
