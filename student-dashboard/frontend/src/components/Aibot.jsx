import { useState } from "react";

export default function AIChatbot({ dataset }) {
	const [open, setOpen] = useState(false);
	const [question, setQuestion] = useState("");
	const [messages, setMessages] = useState([]);

	// Index of the currently expanded FAQ item; null means all collapsed
	const [expandedFaq, setExpandedFaq] = useState(null);

	// Predefined questions that trigger a live AI response when clicked
	const suggestedQuestions = [
		"What is the average exam score?",
		"How does internet access impact performance?",
	];

	// Static FAQ entries answered instantly on the client — no API call required
	const faqData = [
		{
			q: "What is EduMetrics?",
			a: "EduMetrics is an analytics dashboard that visualizes student performance factors like study hours, attendance, and environment data.",
		},
		{
			q: "Where does this data come from?",
			a: "The dashboard reads live parameters directly from your local 'StudentPerformanceFactors.csv' file processed via your Python pipeline.",
		},
		{
			q: "How do I refresh the charts?",
			a: "The system automatically syncs whenever your backend pipeline updates the dataset context file.",
		},
	];

	// Toggle a FAQ item open or closed; clicking an open item collapses it
	const toggleFaq = (index) => {
		setExpandedFaq(expandedFaq === index ? null : index);
	};

	// Send a question to the AI endpoint and append both sides of the exchange
	// to the message history. Accepts an optional pre-filled question (e.g. from
	// a suggested question button); falls back to the controlled input value.
	const askAI = async (selectedQuestion) => {
		const finalQuestion = selectedQuestion || question;
		if (!finalQuestion.trim()) return;

		const userMessage = { sender: "user", text: finalQuestion };
		setMessages((prev) => [...prev, userMessage]);
		setQuestion("");

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/ai/ask`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ question: finalQuestion, data: dataset }),
				},
			);

			const result = await response.json();
			const aiMessage = { sender: "ai", text: result.answer };
			setMessages((prev) => [...prev, aiMessage]);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			{/* Floating toggle button — fixed to the bottom-right corner */}
			<button
				onClick={() => setOpen(!open)}
				style={{
					position: "fixed",
					bottom: "20px",
					right: "20px",
					width: "60px",
					height: "60px",
					borderRadius: "50%",
					border: "none",
					backgroundColor: "#2563eb",
					color: "white",
					fontSize: "24px",
					cursor: "pointer",
					zIndex: 1000,
				}}
			>
				🤖
			</button>

			{/* Chat popup — rendered only while open */}
			{open && (
				<div
					style={{
						position: "fixed",
						bottom: "90px",
						right: "20px",
						width: "350px",
						height: "540px",
						backgroundColor: "white",
						borderRadius: "10px",
						boxShadow: "0 0 10px rgba(0,0,0,0.2)",
						display: "flex",
						flexDirection: "column",
						zIndex: 1000,
					}}
				>
					{/* Header */}
					<div
						style={{
							padding: "15px",
							backgroundColor: "#2563eb",
							color: "white",
							borderTopLeftRadius: "10px",
							borderTopRightRadius: "10px",
							fontWeight: "bold",
						}}
					>
						EduMetrics Billy AI
					</div>

					{/* Scrollable message area */}
					<div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
						{/* FAQ accordion — visible only before the first message is sent */}
						{messages.length === 0 && (
							<div style={{ marginBottom: "15px", padding: "5px" }}>
								<span
									style={{
										fontSize: "12px",
										color: "#4b5563",
										fontWeight: "700",
										display: "block",
										marginBottom: "8px",
									}}
								>
									📚 General Dashboard FAQs
								</span>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "6px",
									}}
								>
									{faqData.map((item, idx) => (
										<div
											key={idx}
											style={{
												border: "1px solid #e5e7eb",
												borderRadius: "6px",
												overflow: "hidden",
											}}
										>
											<button
												onClick={() => toggleFaq(idx)}
												style={{
													width: "100%",
													textAlign: "left",
													padding: "8px 10px",
													fontSize: "12px",
													backgroundColor: "#f9fafb",
													border: "none",
													cursor: "pointer",
													display: "flex",
													justifyContent: "space-between",
													fontWeight: "600",
													color: "#374151",
												}}
											>
												<span>❓ {item.q}</span>
												{/* Chevron indicates the collapsed/expanded state */}
												<span>{expandedFaq === idx ? "▲" : "▼"}</span>
											</button>
											{expandedFaq === idx && (
												<div
													style={{
														padding: "10px",
														fontSize: "12px",
														backgroundColor: "#fff",
														color: "#4b5563",
														borderTop: "1px solid #e5e7eb",
														lineHeight: "1.4",
													}}
												>
													{item.a}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)}

						{/* Conversation history — user messages right-aligned, AI left-aligned */}
						{messages.map((msg, index) => (
							<div
								key={index}
								style={{
									marginBottom: "10px",
									textAlign: msg.sender === "user" ? "right" : "left",
								}}
							>
								<div
									style={{
										display: "inline-block",
										padding: "10px",
										borderRadius: "10px",
										backgroundColor:
											msg.sender === "user" ? "#2563eb" : "#f3f4f6",
										color: msg.sender === "user" ? "white" : "black",
										maxWidth: "80%",
										whiteSpace: "pre-line",
									}}
								>
									{msg.text}
								</div>
							</div>
						))}
					</div>

					{/* Suggested questions — hidden once the conversation is underway (3+ messages) */}
					{messages.length < 3 && (
						<div
							style={{
								padding: "0 10px 10px 10px",
								display: "flex",
								flexDirection: "column",
								gap: "5px",
							}}
						>
							<span
								style={{
									fontSize: "11px",
									color: "#6b7280",
									fontWeight: "600",
								}}
							>
								Ask Billy AI about data:
							</span>
							<div
								style={{ display: "flex", flexDirection: "column", gap: "4px" }}
							>
								{suggestedQuestions.map((q, idx) => (
									<button
										key={idx}
										onClick={() => askAI(q)}
										style={{
											textAlign: "left",
											padding: "6px 10px",
											fontSize: "12px",
											backgroundColor: "#eff6ff",
											color: "#1e40af",
											border: "1px solid #bfdbfe",
											borderRadius: "6px",
											cursor: "pointer",
										}}
										onMouseOver={(e) =>
											(e.currentTarget.style.backgroundColor = "#dbeafe")
										}
										onMouseOut={(e) =>
											(e.currentTarget.style.backgroundColor = "#eff6ff")
										}
									>
										💡 {q}
									</button>
								))}
							</div>
						</div>
					)}

					{/* Input footer — Enter key and Send button both trigger askAI */}
					<div
						style={{
							display: "flex",
							padding: "10px",
							borderTop: "1px solid #ddd",
						}}
					>
						<input
							type="text"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && askAI()}
							placeholder="Type your custom question..."
							style={{
								flex: 1,
								padding: "10px",
								border: "1px solid #ccc",
								borderRadius: "5px",
							}}
						/>
						<button
							onClick={() => askAI()}
							style={{
								marginLeft: "10px",
								padding: "10px 15px",
								backgroundColor: "#2563eb",
								color: "white",
								border: "none",
								borderRadius: "5px",
								cursor: "pointer",
							}}
						>
							Send
						</button>
					</div>
				</div>
			)}
		</>
	);
}
