import ReaderLayout from "@/components/ReaderLayout";

export default function PrivacyPage() {
	return (
		<ReaderLayout title="Privacy Policy" lastUpdated="January 2025">
			<section className="space-y-6">
				<p className="text-lg text-neutral-700 leading-relaxed">
					At Concierge Bank, a banking subsidiary of Richemont Geneva, we uphold the highest standards
					of Swiss banking privacy and discretion. Your personal and financial information is protected
					with the same meticulous care that our Maisons apply to their finest creations.
				</p>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Information We Collect</h2>
				<p className="text-neutral-700 leading-relaxed">
					We collect information necessary to provide you with exceptional private banking services, including:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Personal identification information (name, contact details, government-issued ID)</li>
					<li>Financial information (account details, transaction history, investment preferences)</li>
					<li>Richemont Maison preferences and lifestyle requirements</li>
					<li>Device and usage information when you access our digital banking platform</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">How We Use Your Information</h2>
				<p className="text-neutral-700 leading-relaxed">
					Your information enables us to deliver personalized banking and concierge services:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Provide and manage your private banking accounts and investment portfolios</li>
					<li>Process transactions and deliver financial services with Swiss precision</li>
					<li>Offer bespoke concierge services tailored to your Maison preferences</li>
					<li>Ensure security and prevent fraud through advanced monitoring</li>
					<li>Comply with Swiss and international banking regulations</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Swiss Banking Privacy Standards</h2>
				<p className="text-neutral-700 leading-relaxed">
					As a Geneva-based institution, we adhere to Switzerland's stringent privacy laws and banking
					secrecy traditions. Your information is protected by:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Swiss Federal Data Protection Act (FADP) compliance</li>
					<li>Banking secrecy provisions under Swiss law</li>
					<li>Advanced encryption and security protocols</li>
					<li>Richemont Group's data governance framework</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Information Sharing</h2>
				<p className="text-neutral-700 leading-relaxed">
					We maintain strict confidentiality and only share information when:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Required by Swiss or international banking regulations</li>
					<li>Necessary to provide services you've requested (e.g., partner Maisons for concierge services)</li>
					<li>With your explicit consent</li>
					<li>To prevent fraud or protect our legal rights</li>
				</ul>
				<p className="text-neutral-700 leading-relaxed mt-4">
					We never sell your personal information to third parties.
				</p>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Data Security</h2>
				<p className="text-neutral-700 leading-relaxed">
					Your data is secured through:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Bank-grade encryption (AES-256) for all stored data</li>
					<li>Secure Swiss data centers with physical and digital safeguards</li>
					<li>Multi-factor authentication and biometric access controls</li>
					<li>Regular security audits and penetration testing</li>
					<li>24/7 monitoring by our security team</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Your Rights</h2>
				<p className="text-neutral-700 leading-relaxed">
					You have the right to:
				</p>
				<ul className="list-disc pl-6 space-y-2 text-neutral-700">
					<li>Access and review your personal information</li>
					<li>Request corrections to inaccurate data</li>
					<li>Request deletion of your information (subject to regulatory requirements)</li>
					<li>Opt out of marketing communications</li>
					<li>Receive a copy of your data in a portable format</li>
				</ul>

				<h2 className="text-2xl font-bold text-neutral-900 mt-12 mb-4">Contact Us</h2>
				<p className="text-neutral-700 leading-relaxed">
					For privacy inquiries or to exercise your rights, please contact our Data Protection Officer:
				</p>
				<p className="text-neutral-700 mt-4">
					<strong>Email:</strong> privacy@conciergebank.com<br />
					<strong>Address:</strong> Concierge Bank, Rue du Rhône, 1204 Geneva, Switzerland
				</p>
			</section>
		</ReaderLayout>
	);
}
