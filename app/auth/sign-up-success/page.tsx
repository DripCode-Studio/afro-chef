import Link from "next/link"
import { ChefHat, Mail, ArrowRight } from "lucide-react"
import { NeuCard, NeuCardContent, NeuCardHeader } from "@/components/ui/neu-card"
import { NeuButton } from "@/components/ui/neu-button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange border-[3px] border-charcoal shadow-[4px_4px_0px_0px_#0f1724] transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[2px_2px_0px_0px_#0f1724]">
          <ChefHat className="h-7 w-7 text-white" />
        </div>
        <span className="text-2xl font-bold text-charcoal">AfroChef</span>
      </Link>

      <NeuCard className="w-full max-w-md">
        <NeuCardHeader className="bg-teal text-white">
          <div className="flex items-center gap-3">
            <Mail className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Check Your Email</h1>
              <p className="text-white/80 text-sm mt-1">Almost there!</p>
            </div>
          </div>
        </NeuCardHeader>
        <NeuCardContent className="p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-10 w-10 text-teal" />
          </div>

          <h2 className="text-xl font-bold text-charcoal mb-3">Confirm Your Account</h2>
          <p className="text-muted-foreground mb-6">
            {
              "We've sent a confirmation email to your inbox. Click the link in the email to activate your account and start cooking!"
            }
          </p>

          <div className="space-y-3">
            <Link href="/auth/login">
              <NeuButton variant="primary" className="w-full">
                Go to Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </NeuButton>
            </Link>
            <Link href="/">
              <NeuButton variant="outline" className="w-full">
                Back to Home
              </NeuButton>
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            {"Didn't receive the email? Check your spam folder or try signing up again."}
          </p>
        </NeuCardContent>
      </NeuCard>
    </div>
  )
}
