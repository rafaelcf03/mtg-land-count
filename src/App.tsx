import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button, Switch, TextField, Typography } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./App.css";

const schema = z.object({
  avgManaValue: z.number(),
  nCheapDraw: z.number(),
  nCheapManaRamp: z.number(),
  nNonMythicLand: z.number(),
  nMythicLand: z.number(),
  companion: z.boolean(),
});

type FormFields = z.infer<typeof schema>;

function App() {
  const [avgManaValue, setAvgManaValue] = useState<number>(0);
  const [nCheapDraw, setNCheapDraw] = useState<number>(0);
  const [nCheapManaRamp, setNCheapManaRamp] = useState<number>(0);
  const [nNonMythicLand, setNNonMythicLand] = useState<number>(0);
  const [nMythicLand, setMythicLand] = useState<number>(0);
  const [companion, setCompanion] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      avgManaValue,
      nCheapDraw,
      nCheapManaRamp,
      nNonMythicLand,
      nMythicLand,
      companion,
    },
    resolver: zodResolver(schema),
  });

  const calculateLandCount = (nCardDeck: number): number => {
    let landCount = 0;

    if (nCardDeck == 99) {
      landCount =
        31.42 +
        3.13 * avgManaValue -
        0.28 * (nCheapDraw + nCheapManaRamp) +
        nNonMythicLand * 0.38 +
        nMythicLand * 0.74;
    } else if (nCardDeck == 80) {
      landCount =
        26.43 +
        2.53 * avgManaValue -
        0.28 * (nCheapDraw + nCheapManaRamp) +
        nNonMythicLand * 0.38 +
        nMythicLand * 0.74;
    } else {
      landCount =
        19.59 +
        1.9 * avgManaValue -
        0.28 * (nCheapDraw + nCheapManaRamp) +
        0.27 * Number(companion) +
        nNonMythicLand * 0.38 +
        nMythicLand * 0.74;
    }

    return landCount;
  };

  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    console.log(data);
  };

  return (
    <main className="main-body">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="form">
        <Controller
          control={control}
          name="avgManaValue"
          render={({ field: { onChange, value } }) => (
            <TextField
              type="number"
              autoFocus
              label="Valor médio do custo de mana"
              variant="outlined"
              onChange={(e) => {
                onChange(parseInt(e.target.value));
              }}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="nCheapDraw"
          render={({ field: { onChange, value } }) => (
            <TextField
              type="number"
              label="Quantidade de cartas, de custo baixo, que compram"
              variant="outlined"
              onChange={(e) => {
                onChange(parseInt(e.target.value));
              }}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="nCheapManaRamp"
          render={({ field: { onChange, value } }) => (
            <TextField
              type="number"
              label="Quantidade de cartas, de custo baixo, que rampam"
              variant="outlined"
              onChange={(e) => {
                onChange(parseInt(e.target.value));
              }}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="nNonMythicLand"
          render={({ field: { onChange, value } }) => (
            <TextField
              type="number"
              label="Quantidade cartas modais que entram viradas"
              variant="outlined"
              onChange={(e) => {
                onChange(parseInt(e.target.value));
              }}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="nMythicLand"
          render={({ field: { onChange, value } }) => (
            <TextField
              type="number"
              label="Quantidade cartas modais que entram desviradas"
              variant="outlined"
              onChange={(e) => {
                onChange(parseInt(e.target.value));
              }}
              value={value}
            />
          )}
        />

        <label className="switch-label">
          <Typography className="text">Companion</Typography>
          <Controller
            control={control}
            name="companion"
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Switch
                onChange={() => {
                  onChange(!value);
                }}
                checked={value}
                size="medium"
                sx={{ margin: 0 }}
              />
            )}
          />
        </label>

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          color="primary"
        >
          Salvar
        </Button>
      </form>
    </main>
  );
}

export default App;
