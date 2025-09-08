"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Search, Filter, Archive, Trash2, Star, Clock, User, Send, MoreHorizontal, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  date: string
  status: "unread" | "read" | "replied" | "archived"
  priority: "low" | "medium" | "high"
  starred: boolean
}

export default function MessagesPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [replyText, setReplyText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sendingReply, setSendingReply] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Load messages on component mount and when tab changes
  useEffect(() => {
    loadMessages()
  }, [activeTab])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view messages.",
          variant: "destructive",
        })
        return
      }

      const params = new URLSearchParams()
      if (activeTab !== 'all') {
        if (activeTab === 'starred') {
          params.set('starred', 'true')
        } else {
          params.set('status', activeTab)
        }
      }

      const response = await fetch(`/api/messages?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        setMessages(result.data)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to load messages')
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load messages.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const messageStats = {
    total: messages.length,
    unread: messages.filter((m) => m.status === "unread").length,
    starred: messages.filter((m) => m.starred).length,
    archived: messages.filter((m) => m.status === "archived").length,
  }

  const toggleStar = async (messageId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const message = messages.find(m => m.id === messageId)
      if (!message) return

      const response = await fetch(`/api/messages?id=${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ starred: !message.starred }),
      })

      if (response.ok) {
        setMessages((prev) => prev.map((msg) =>
          msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
        ))
      }
    } catch (error) {
      console.error('Failed to toggle star:', error)
      toast({
        title: "Error",
        description: "Failed to update message.",
        variant: "destructive",
      })
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`/api/messages?id=${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'read' }),
      })

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId && msg.status === "unread" ? { ...msg, status: "read" } : msg)),
        )
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const archiveMessage = async (messageId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`/api/messages?id=${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'archived' }),
      })

      if (response.ok) {
        setMessages((prev) => prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "archived" } : msg
        ))
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error('Failed to archive message:', error)
      toast({
        title: "Error",
        description: "Failed to archive message.",
        variant: "destructive",
      })
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`/api/messages?id=${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null)
        }
        toast({
          title: "Success!",
          description: "Message deleted successfully!",
        })
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      })
    }
  }

  const sendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return

    setSendingReply(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to send replies.",
          variant: "destructive",
        })
        return
      }

      // Send reply via API (this will trigger email sending)
      const response = await fetch('/api/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          reply: replyText,
        }),
      })

      if (response.ok) {
        // Update message status to replied
        setMessages((prev) => prev.map((msg) =>
          msg.id === selectedMessage.id ? { ...msg, status: "replied" } : msg
        ))

        // Update selected message
        setSelectedMessage({ ...selectedMessage, status: "replied" })

        setReplyText("")
        toast({
          title: "Success!",
          description: "Reply sent successfully!",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send reply')
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send reply.",
        variant: "destructive",
      })
    } finally {
      setSendingReply(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-theme-info"
      case "read":
        return "bg-muted-foreground"
      case "replied":
        return "bg-theme-success"
      case "archived":
        return "bg-theme-warning"
      default:
        return "bg-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Messages</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage contact form submissions and inquiries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-sm sm:text-base">
            <Archive className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Archive All Read</span>
            <span className="sm:hidden">Archive</span>
          </Button>
        </div>
      </div>

      {/* Message Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {Object.entries(messageStats).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold">{value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground capitalize">
                  {key === "total" ? "Total Messages" : key}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3 sm:space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
                size="sm"
              />
            </div>
            <Button variant="outline" size="sm" className="p-2">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs sm:text-sm">Unread</TabsTrigger>
              <TabsTrigger value="starred" className="text-xs sm:text-sm">Starred</TabsTrigger>
              <TabsTrigger value="archived" className="text-xs sm:text-sm">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-2 mt-4">
              {
                loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="animate-pulse space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-muted rounded-full"></div>
                            <div className="h-4 bg-muted rounded w-1/4"></div>
                            <div className="h-4 bg-muted rounded w-1/6 ml-auto"></div>
                          </div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-3/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredMessages.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {activeTab === 'all' ? 'No messages yet' : `No ${activeTab} messages`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredMessages.map((message) => (
                  <Card
                    key={message.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedMessage?.id === message.id ? "ring-2 ring-primary" : ""
                    } ${message.status === "unread" ? "bg-muted/30" : ""}`}
                    onClick={() => {
                      setSelectedMessage(message)
                      markAsRead(message.id)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(message.status)}`} />
                          <h3 className="font-medium truncate">{message.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleStar(message.id)
                            }}
                          >
                            <Star className={`h-4 w-4 ${message.starred ? "fill-yellow-500 text-yellow-500" : ""}`} />
                          </Button>
                        </div>
                        <Badge variant={getPriorityColor(message.priority)} className="text-xs">
                          {message.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 truncate">{message.subject}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{message.message}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.date).toLocaleDateString()}
                        </span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {message.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )
              }
            </TabsContent>
          </Tabs>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="h-fit">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      {selectedMessage.name}
                    </CardTitle>
                    <CardDescription>{selectedMessage.email}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleStar(selectedMessage.id)}>
                      <Star className={`h-4 w-4 ${selectedMessage.starred ? "fill-yellow-500 text-yellow-500" : ""}`} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => archiveMessage(selectedMessage.id)}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteMessage(selectedMessage.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(selectedMessage.date).toLocaleString()}
                  </span>
                  <Badge variant={getPriorityColor(selectedMessage.priority)}>
                    {selectedMessage.priority} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">{selectedMessage.subject}</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Reply Section */}
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-3">Reply</h4>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </Button>
                      </div>
                      <Button
                        onClick={sendReply}
                        disabled={!replyText.trim() || sendingReply}
                        className="relative overflow-hidden group bg-gradient-primary border-0 text-white hover:shadow-elevation-medium"
                      >
                        {sendingReply ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a message to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
