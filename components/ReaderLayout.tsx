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
						<svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden>
							<path d="M20 4 L36 32 L28 32 L20 18 L12 32 L4 32 Z" fill="#2C3E5A" />
							<path d="M20 18 L28 32 L12 32 Z" fill="#354A68" />
						</svg>
						<span className="font-work-sans text-xl font-extrabold text-neutral-900">
							Inv<span className="text-navy-700">Bank</span>
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
