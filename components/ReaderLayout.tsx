import Link from "next/link";
import type { ReactNode } from "react";

interface ReaderLayoutProps {
	title: string;
	lastUpdated?: string;
	children: ReactNode;
}

export default function ReaderLayout({ title, lastUpdated, children }: ReaderLayoutProps) {
	return (
		<div className="min-h-screen bg-neutral-50">
			{/* Simple Header */}
			<header className="bg-white border-b border-neutral-200">
				<div className="container mx-auto px-6 py-6">
					<Link href="/" className="inline-flex items-center space-x-2 hover:opacity-80 transition-opacity">
						<div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center">
							<span className="text-white font-bold text-lg">C</span>
						</div>
						<span className="font-display text-xl font-bold text-neutral-900">
							Concierge<span className="text-gold-600">Bank</span>
						</span>
					</Link>
				</div>
			</header>

			{/* Reader Content */}
			<main className="container mx-auto px-6 py-16 max-w-3xl">
				<article className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12">
					<header className="mb-12 border-b border-neutral-200 pb-8">
						<h1 className="text-4xl font-display font-bold text-neutral-900 mb-4">
							{title}
						</h1>
						{lastUpdated && (
							<p className="text-sm text-neutral-500">
								Last Updated: {lastUpdated}
							</p>
						)}
					</header>

					<div className="reader-content text-neutral-700 leading-relaxed space-y-6">
						{children}
					</div>
				</article>

				{/* Back to Home */}
				<div className="mt-8 text-center">
					<Link
						href="/"
						className="inline-flex items-center text-sm text-neutral-600 hover:text-gold-600 transition-colors"
					>
						← Back to Home
					</Link>
				</div>
			</main>
		</div>
	);
}
