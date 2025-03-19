"use client"

import { useState } from "react"
import { Plus, Dumbbell, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import WorkoutForm from "@/components/workout-form"

export default function WorkoutFormModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 h-14 w-14 rounded-full bg-[#C62127] hover:bg-[#2E5C9D] shadow-lg transition-colors duration-300"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur border-gray-800">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2 text-[#C62127]">
              <Dumbbell className="size-5" />
              <span>记录训练</span>
            </DialogTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="absolute -right-20 bottom-0 opacity-20 pointer-events-none hidden md:block">
            <div className="relative w-48 h-48">
              <Image
                src="/images/mitsui-shooting.png"
                alt="Basketball player shooting"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <WorkoutForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

