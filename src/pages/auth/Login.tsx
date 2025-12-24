import { Link } from "react-router"
import { AppConstantRoutes } from "../../routes/path"
import Input from "../../components/Input"


const Login = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f0eeee] px-4 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Sign in to your account to continue</p>
                </div>

                <div className="rounded-lg bg-white border border-border bg-card p-8 shadow-sm">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                                Email
                            </label>
                            {/* <input
                                id="email"
                                type="email"
                                required
                                className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                placeholder="Enter your email"
                            /> */}
                            <Input
                                id="email"
                                name="email"
                                value={"Test value"}

                            // error="Something went wrong!"
                            />

                            <Input
                                id="name"
                                name="name"
                                value={"Name value"}
                                type="password"

                            // error="Something went wrong!"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"

                                required
                                className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                        >
                            Sign in
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        {"Don't have an account? "}
                        <Link to={AppConstantRoutes.path.auth.register} className="font-medium text-primary hover:text-primary/90 transition-colors">
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login