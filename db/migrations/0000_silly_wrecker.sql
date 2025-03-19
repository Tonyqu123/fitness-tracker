CREATE TABLE "exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"target_weight" integer NOT NULL,
	"target_reps" integer NOT NULL,
	"deadline" timestamp,
	"achieved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" text PRIMARY KEY NOT NULL,
	"exercise_id" text NOT NULL,
	"weight" integer NOT NULL,
	"reps" integer NOT NULL,
	"date" timestamp NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;