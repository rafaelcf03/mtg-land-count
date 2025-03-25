import { z } from "zod";

const formSchema = z.object({
  nCardDeck: z.number(),
  avgManaValue: z.number(),
  deckList: z.string(),
  deckListBool: z.boolean(),
  nCheapDraw: z.number().int(),
  nCheapManaRamp: z.number().int(),
  nNonMythicLand: z.number().int(),
  nMythicLand: z.number().int(),
  companion: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

const formDefaultValues: FormSchema = {
  nCardDeck: 60,
  avgManaValue: 0,
  deckList: "",
  deckListBool: false,
  nCheapDraw: 0,
  nCheapManaRamp: 0,
  nNonMythicLand: 0,
  nMythicLand: 0,
  companion: false,
};

export { formDefaultValues, formSchema, type FormSchema };
