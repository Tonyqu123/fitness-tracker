"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { addWorkout } from "@/lib/actions"
import { useTrainingEffect } from "@/hooks/use-training-effect"

const workoutFormSchema = z.object({
  exercise: z.string({
    required_error: "请选择训练动作",
  }),
  weight: z.coerce.number().min(0, { message: "重量不能小于0" }).max(1000, { message: "重量不能大于1000kg" }),
  reps: z.coerce.number().int().min(1, { message: "次数最少为1" }).max(100, { message: "次数不能大于100" }),
})

interface WorkoutFormProps {
  onSuccess?: () => void
}

export default function WorkoutForm({ onSuccess }: WorkoutFormProps) {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [animateWeight, setAnimateWeight] = useState(false)
  const { triggerEffect } = useTrainingEffect()

  const form = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      exercise: "",
      weight: 0,
      reps: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof workoutFormSchema>) {
    setSubmitting(true)
    setAnimateWeight(true)

    try {
      await addWorkout(values)

      toast({
        title: "记录已保存",
        description: `${getExerciseName(values.exercise)}: ${values.weight}kg × ${values.reps}次`,
      })

      // Trigger basketball animation effect
      triggerEffect()

      form.reset({
        exercise: "",
        weight: 0,
        reps: 1,
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "保存失败",
        description: "请稍后再试",
      })
    } finally {
      setSubmitting(false)
      setTimeout(() => setAnimateWeight(false), 500)
    }
  }

  const exercises = [
    { id: "bench-press", name: "卧推" },
    { id: "squat", name: "深蹲" },
    { id: "deadlift", name: "硬拉" },
    { id: "pull-up", name: "引体向上" },
    { id: "shoulder-press", name: "肩推" },
    { id: "barbell-row", name: "杠铃划船" },
    { id: "leg-press", name: "腿推" },
    { id: "bicep-curl", name: "二头弯举" },
  ]

  function getExerciseName(id: string): string {
    const exercise = exercises.find((e) => e.id === id)
    return exercise ? exercise.name : id
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="exercise"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">训练动作</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-[#C62127]">
                    <SelectValue placeholder="选择训练动作" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {exercises.map((exercise) => (
                    <SelectItem key={exercise.id} value={exercise.id} className="focus:bg-gray-700">
                      {exercise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">重量 (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    {...field}
                    className={`bg-gray-800 border-gray-700 focus:ring-[#C62127] number-input ${animateWeight ? "animate-save" : ""}`}
                    inputMode="decimal"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reps"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">次数</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="bg-gray-800 border-gray-700 focus:ring-[#C62127] number-input"
                    inputMode="numeric"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#C62127] hover:bg-[#2E5C9D] text-white transition-all duration-300"
        >
          {submitting ? "记录中..." : "记录训练"}
          <Plus className="ml-2 size-4" />
        </Button>
      </form>
    </Form>
  )
}

