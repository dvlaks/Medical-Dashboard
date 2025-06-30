import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Stethoscope, Eye, EyeOff } from "lucide-react"

const LoginPage = () => {
	const [email, setEmail] = useState("admin@entnt.in")
	const [password, setPassword] = useState("admin123")
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const { login } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = (e) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		setTimeout(() => {
			const result = login(email, password)
			if (result) {
				if (result.role === "Admin") {
					navigate("/app/dashboard")
				} else {
					navigate("/app/my-dashboard")
				}
			} else {
				setError("Invalid email or password.")
			}
			setLoading(false)
		}, 500)
	}

	const demoAccounts = [
		{ email: "admin@entnt.in", password: "admin123", role: "Admin" },
		{ email: "john@entnt.in", password: "patient123", role: "Patient" },
	]

	const fillDemo = (account) => {
		setEmail(account.email)
		setPassword(account.password)
	}

	return (
		<>
			<style>{`
				body, html {
					overflow: hidden !important;
					font-family: "Poppins", -apple-system, BlinkMacSystemFont, sans-serif;
				}
				::-webkit-scrollbar {
					display: none;
				}
				* {
					font-family: "Poppins", -apple-system, BlinkMacSystemFont, sans-serif;
				}
			`}</style>
			<div
				style={{
					height: "100vh",
					background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "8px",
					overflow: "hidden",
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
				}}
			>
				<div
					style={{
						background: "rgba(255, 255, 255, 0.1)",
						backdropFilter: "blur(20px)",
						borderRadius: "20px",
						border: "1px solid rgba(255, 255, 255, 0.2)",
						boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
						padding: "20px",
						width: "100%",
						maxWidth: "400px",
						maxHeight: "calc(100vh - 16px)",
						overflow: "hidden",
					}}
				>
					<div style={{ textAlign: "center", marginBottom: "20px" }}>
						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								background: "rgba(255, 255, 255, 0.2)",
								borderRadius: "16px",
								padding: "10px",
								marginBottom: "12px",
							}}
						>
							<Stethoscope size={24} color="white" />
						</div>
						<h1
							style={{
								color: "white",
								fontSize: "24px",
								fontWeight: "800",
								marginBottom: "4px",
								letterSpacing: "-0.02em",
								fontFamily: "Poppins, sans-serif",
							}}
						>
							Welcome Back
						</h1>
						<p style={{
							color: "rgba(255, 255, 255, 0.8)",
							fontSize: "13px",
							fontWeight: "400",
							letterSpacing: "0.01em",
							fontFamily: "Poppins, sans-serif",
						}}>
							Sign in to your ENT & Dental dashboard
						</p>
					</div>

					<div>
						<div style={{ marginBottom: "16px" }}>
							<form onSubmit={handleSubmit}>
								<div style={{ marginBottom: "14px" }}>
									<label
										style={{
											display: "block",
											color: "white",
											fontSize: "12px",
											fontWeight: "600",
											marginBottom: "5px",
											letterSpacing: "0.02em",
											fontFamily: "Poppins, sans-serif",
										}}
									>
										Email Address
									</label>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										style={{
											width: "100%",
											padding: "10px",
											borderRadius: "10px",
											border: "1px solid rgba(255, 255, 255, 0.2)",
											background: "rgba(255, 255, 255, 0.1)",
											color: "white",
											fontSize: "14px",
											backdropFilter: "blur(10px)",
											outline: "none",
											boxSizing: "border-box",
										}}
										placeholder="Enter your email"
										required
									/>
								</div>

								<div style={{ marginBottom: "14px" }}>
									<label
										style={{
											display: "block",
											color: "white",
											fontSize: "12px",
											fontWeight: "600",
											marginBottom: "5px",
											letterSpacing: "0.02em",
											fontFamily: "Poppins, sans-serif",
										}}
									>
										Password
									</label>
									<div style={{ position: "relative" }}>
										<input
											type={showPassword ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											style={{
												width: "100%",
												padding: "10px",
												paddingRight: "40px",
												borderRadius: "10px",
												border: "1px solid rgba(255, 255, 255, 0.2)",
												background: "rgba(255, 255, 255, 0.1)",
												color: "white",
												fontSize: "14px",
												backdropFilter: "blur(10px)",
												outline: "none",
												boxSizing: "border-box",
											}}
											placeholder="Enter your password"
											required
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											style={{
												position: "absolute",
												right: "10px",
												top: "50%",
												transform: "translateY(-50%)",
												background: "none",
												border: "none",
												color: "rgba(255, 255, 255, 0.6)",
												cursor: "pointer",
												padding: "4px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
										</button>
									</div>
								</div>

								<div style={{ textAlign: "right", marginBottom: "14px" }}>
									<button
										type="button"
										style={{
											background: "none",
											border: "none",
											color: "white",
											fontSize: "11px",
											cursor: "pointer",
											opacity: 0.75,
											textDecoration: "underline",
										}}
									>
										Forgot Password?
									</button>
								</div>

								{error && (
									<div
										style={{
											background: "rgba(239, 68, 68, 0.25)",
											border: "1px solid rgba(239, 68, 68, 0.4)",
											borderRadius: "8px",
											padding: "8px",
											color: "#FCA5A5",
											fontSize: "11px",
											marginBottom: "12px",
											textAlign: "center",
										}}
									>
										{error}
									</div>
								)}

								<button
									type="submit"
									disabled={loading}
									style={{
										width: "100%",
										backgroundColor: "#0EA5E9",
										color: "white",
										border: "none",
										borderRadius: "10px",
										padding: "12px",
										fontSize: "14px",
										fontWeight: "600",
										cursor: "pointer",
										marginBottom: "16px",
										transition: "background-color 0.2s",
										opacity: loading ? 0.7 : 1,
									}}
								>
									{loading ? "Logging in..." : "Login"}
								</button>
							</form>

							<div
								style={{
									borderTop: "1px solid rgba(255, 255, 255, 0.1)",
									paddingTop: "12px",
									textAlign: "center",
								}}
							>
								<h3
									style={{
										color: "white",
										fontSize: "12px",
										fontWeight: "600",
										marginBottom: "8px",
									}}
								>
									Demo Accounts
								</h3>
								<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
									{demoAccounts.map((account, index) => (
										<button
											key={index}
											type="button"
											onClick={() => fillDemo(account)}
											style={{
												background: "rgba(255, 255, 255, 0.1)",
												border: "1px solid rgba(255, 255, 255, 0.2)",
												borderRadius: "6px",
												padding: "8px",
												color: "white",
												cursor: "pointer",
												fontSize: "11px",
												textAlign: "left",
												transition: "all 0.2s",
											}}
										>
											<div style={{ fontWeight: "600", marginBottom: "1px" }}>
												{account.role}
											</div>
											<div style={{ opacity: 0.7, fontSize: "10px" }}>
												{account.email}
											</div>
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default LoginPage
