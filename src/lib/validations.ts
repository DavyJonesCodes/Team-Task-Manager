import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters.")
    .max(80, "Project name must be less than 80 characters."),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters.")
    .optional()
    .or(z.literal("")),
});

export const updateProjectSchema = createProjectSchema.extend({
  status: z.enum(["active", "completed", "archived"]),
});

export const createTaskSchema = z.object({
  projectId: z.string().uuid("Invalid project id."),
  title: z
    .string()
    .min(2, "Task title must be at least 2 characters.")
    .max(120, "Task title must be less than 120 characters."),
  description: z
    .string()
    .max(800, "Description must be less than 800 characters.")
    .optional()
    .or(z.literal("")),
  status: z.enum(["todo", "in_progress", "review", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  assignedToId: z.string().optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(2, "Task title must be at least 2 characters.")
    .max(120, "Task title must be less than 120 characters.")
    .optional(),
  description: z
    .string()
    .max(800, "Description must be less than 800 characters.")
    .optional()
    .or(z.literal("")),
  status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  assignedToId: z.string().optional().nullable().or(z.literal("")),
  dueDate: z.string().optional().nullable().or(z.literal("")),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
