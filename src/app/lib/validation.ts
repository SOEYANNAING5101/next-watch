import { z } from "zod";
import {
    STANDOUT_ELEMENTS,
    BRAIN_POWER_OPTIONS,
    ATTENTION_OPTIONS,
    VERDICT_OPTIONS
} from "./vibe-rating-config"
import { ROULETTE_OPTIONS } from './roulette-config'

const toValues = (arr:{label:string}[])=>arr.map((o)=>o.label)as[string, ...string[]]
const subScore = z.number().int().min(0).max(20);

export const ratingSchema = z.object({
    tmdbId: z.number().int().positive(),
    acting: subScore,
    plot: subScore,
    cinematography: subScore,
    pacing: subScore,
    verdict: z.number().refine((p)=>VERDICT_OPTIONS.some((o)=>o.points ===p),"Invalid verdict"),
    attentionTest: z.enum(Object.keys(ATTENTION_OPTIONS) as[string, ...string[]]),
    brainPower: z.enum(toValues(BRAIN_POWER_OPTIONS)),
    standoutElements: z.array(z.enum(toValues(STANDOUT_ELEMENTS))).min(1).max(2)
})
export const listNameSchema =z
    .string()
    .trim()
    .min(1,"List Name is required")
    .max(50,"List name is too long")

export const uuidSchema = z.uuid()

export const genreLabelSchema = z.enum(toValues(ROULETTE_OPTIONS.genres))
export const decadesLabelSchema = z.enum(toValues(ROULETTE_OPTIONS.decades))
export const languagesLabelSchema = z.enum(toValues(ROULETTE_OPTIONS.languages))
