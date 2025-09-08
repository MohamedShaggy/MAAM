"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { useSiteContentStore } from "@/lib/site-content-store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { content: siteContent } = useSiteContentStore()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: siteContent.forms.contact.successTitle,
      description: siteContent.forms.contact.successDescription,
    })

    setIsSubmitting(false)
    e.currentTarget.reset()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="relative overflow-hidden rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 p-6 transition-all duration-300 hover:border-primary/50">
        <div className="absolute -inset-1 bg-gradient-primary/10 rounded-xl blur opacity-25 hover:opacity-100 transition duration-1000 hover:duration-200"></div>

        <div className="relative">
          <h3 className="text-2xl font-bold mb-6">{siteContent.forms.contact.title}</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                placeholder={siteContent.forms.contact.namePlaceholder}
                required
                className="bg-background/50 border-border focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder={siteContent.forms.contact.emailPlaceholder}
                required
                className="bg-background/50 border-border focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder={siteContent.forms.contact.subjectPlaceholder}
                required
                className="bg-background/50 border-border focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder={siteContent.forms.contact.messagePlaceholder}
                rows={5}
                required
                className="bg-background/50 border-border focus:border-primary focus:ring-primary/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:bg-gradient-primary-hover border-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>{siteContent.forms.contact.submittingText}</>
              ) : (
                <>
                  {siteContent.forms.contact.submitButtonText} <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
