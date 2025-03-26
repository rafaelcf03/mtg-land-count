import { z } from "zod";
import translate from "../utils/dictionary";

const deckListSchema = z.discriminatedUnion("hasDecklist", [
  z.object({
    hasDecklist: z.literal(true),
    deckList: z.string().min(1, { message: translate("decklist-error") }),
  }),
  z.object({
    hasDecklist: z.literal(false),
  }),
]);

const formSchema = z
  .object({
    nCardDeck: z.number(),
    avgManaValue: z.number(),
    nCheapDraw: z.number().int(),
    nCheapManaRamp: z.number().int(),
    nNonMythicLand: z.number().int(),
    nMythicLand: z.number().int(),
    companion: z.boolean(),
  })
  .and(deckListSchema);

type FormSchema = z.infer<typeof formSchema>;

const formDefaultValues: FormSchema = {
  nCardDeck: 60,
  avgManaValue: 0,
  hasDecklist: false,
  nCheapDraw: 0,
  nCheapManaRamp: 0,
  nNonMythicLand: 0,
  nMythicLand: 0,
  companion: false,
};

export { formDefaultValues, formSchema, type FormSchema };
