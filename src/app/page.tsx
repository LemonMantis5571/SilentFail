"use client";
import Link from "next/link";
import { Zap, ArrowRight, ShieldAlert, Code2, Minus, Square, X, Github } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { motion } from "framer-motion";


const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <main>
        <section className="relative pt-20 pb-32 md:pt-32 overflow-hidden">


          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10"
          />

          <div className="container mx-auto px-4 relative z-10">

            <motion.div
              exit={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -z-10 bg-primary/20 w-[120%] h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[120px] rounded-full pointer-events-none"
            />

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div
                className="flex-1 text-center lg:text-left space-y-8"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <Badge variant="outline" className="px-4 py-1 border-primary/30 text-primary bg-primary/10 rounded-full backdrop-blur-sm">
                    <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-primary inline-block shadow-[0_0_10px_currentColor]"></span>
                    New: AI Log Analysis (Soon™)
                  </Badge>
                </motion.div>

                <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  The <span className="text-primary bg-clip-text">Dead Man's Switch</span> <br />
                  for your Cron Jobs.
                </motion.h1>

                <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  You have backup scripts. But do they actually run?
                  SilentFail listens for a heartbeat. If your script goes silent, we wake you up.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="https://github.com/LemonMantis5571/SilentFail/blob/main/docs/API.md" target="_blank">
                    <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent border-primary/20 hover:bg-primary/10 hover:scale-105 transition-all">
                      View Documentation
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" className="h-12 px-8 text-base bg-blue-700 shadow-lg text-white border-blue-400/20 hover:bg-blue-600/80 hover:scale-105 transition-all">
                      Start Monitoring
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                </motion.div>


              </motion.div>

              {/* Visual/Code Block */}
              <motion.div
                className="flex-1 w-full max-w-lg lg:max-w-xl"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl text-card-foreground shadow-2xl overflow-hidden group">

                  <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="flex items-center justify-between pl-3 border-b border-border/50 bg-muted/10">
                    <div className="flex items-center gap-2.5 ml-1">
                      <div className="text-[11px] text-muted-foreground/70 font-mono">bash — 80x24</div>
                    </div>
                    <div className="flex items-center -mr-1">
                      <div className="px-3 py-3 hover:bg-white/5 transition-colors cursor-default group/win">
                        <Minus className="h-3.5 w-3.5 text-muted-foreground/50" />
                      </div>
                      <div className="px-3 py-3 hover:bg-white/5 transition-colors cursor-default group/win">
                        <Square className="h-3 w-3 text-muted-foreground/50" />
                      </div>
                      <div className="pl-3 pr-4 py-3 hover:bg-red-600 transition-colors cursor-default group/win">
                        <X className="h-3.5 w-3.5 text-muted-foreground/50 group-hover/win:text-white" />
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className="p-6 font-mono text-sm space-y-4 bg-[#0a0a0a] text-green-400"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <motion.div variants={fadeInUp} className="flex">
                      <span className="text-blue-400 mr-2">~</span>
                      <span className="text-slate-500"># 1. Your backup script runs...</span>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                      <span className="text-blue-400 mr-2">➜</span>
                      <span className="text-slate-100">pg_dump database &gt; backup.sql</span>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="flex">
                      <span className="text-blue-400 mr-2">~</span>
                      <span className="text-slate-500"># 2. Tell SilentFail it worked</span>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                      <span className="text-blue-400 mr-2">➜</span>
                      <span className="text-slate-100">curl </span>
                      <span className="text-yellow-300">https://api.silentfail.com/ping/5f9a2b</span>
                    </motion.div>
                    <motion.div
                      variants={fadeInUp}
                      className="pt-4 text-white flex items-center gap-2"
                    >
                      <span className="text-green-500">✔</span> 200 OK. Heartbeat received.
                    </motion.div>
                  </motion.div>
                </div>

              </motion.div>
            </div>
          </div>
        </section>


        <section id="features" className="py-24 bg-muted/5 border-y border-border/40">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">More than just a ping</h2>
              <p className="text-muted-foreground text-lg">
                Simple enough for a bash script, smart enough to debug your stack traces.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                { title: "Zero Config", icon: Zap, desc: "No SDKs to install. No complex agents. Just a simple URL. If you can make an HTTP request, you can monitor it." },
                { title: "AI Crash Analysis (Soon™)", icon: Code2, desc: "Pipe your error logs to us. Our AI parses the stack trace and emails you exactly why the script failed." },
                { title: "Smart Grace Periods", icon: ShieldAlert, desc: "We learn how long your jobs usually take. If a 5-minute backup suddenly takes 2 seconds, we'll flag it." }
              ].map((feature, i) => (
                <motion.div key={i} variants={fadeInUp} whileHover={{ y: -5 }} className="h-full">
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/40 transition-colors duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.desc}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>


        <section id="how-it-works" className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                className="space-y-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tight">Set up in seconds</motion.h2>
                <div className="space-y-6">
                  {[
                    { title: "Create a Monitor", desc: "Give it a name and an expected schedule (e.g., 'Every 24 hours')." },
                    { title: "Add the Hook", desc: "Append our curl command to the end of your script or CI/CD pipeline." },
                    { title: "Sleep Soundly", desc: "We only alert you if the signal goes dark. No signal = Alarm." }
                  ].map((step, i) => (
                    <motion.div key={i} variants={fadeInUp} className="flex gap-4 group">
                      <div className="flex-none h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent blur-[100px]" />
                <div className="relative bg-card/80 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl p-8 ring-1 ring-white/10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="font-medium text-lg">Database Backup</div>
                      <div className="text-sm text-muted-foreground">Expected: Every 24h</div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">Healthy</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Ping</span>
                      <span className="font-mono text-foreground/80">Today, 04:00 AM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Next Expected</span>
                      <span className="font-mono text-foreground/80">Tomorrow, 04:00 AM</span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full mt-4 overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                        initial={{ width: 0 }}
                        whileInView={{ width: "30%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-border/40 relative">
          <motion.div
            className="absolute inset-0 bg-primary/5 blur-3xl pointer-events-none"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Stop guessing if your cron jobs ran.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join developers who sleep better knowing SilentFail is watching their background tasks.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Button size="lg" className="h-12 bg-blue-700 px-10 text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all text-neutral-300">
                  <Link href="/dashboard">Start Monitoring Now</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/40 bg-muted/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>© 2026 SilentFail. Built by a Developer for Developers.</div>
          <div className="flex gap-6 items-center">
            <Link href="https://github.com/LemonMantis5571/SilentFail" target="_blank" className="hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="https://x.com/lee_gv" target="_blank" className="hover:text-primary transition-colors">
              <span className="text-xl">𝕏</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}