import * as Dialog from "@radix-ui/react-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Select from "@radix-ui/react-select";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { CaretDown, Check, GameController } from "phosphor-react";
import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { Input } from "./Form/Input";


interface Game {
  id: string;
  title: string;
}

export const CreateAdModal = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [weekDays, setWeekDays] = useState<string[]>([]);
    const [useVoiceChannel, setUseVoiceChannel] = useState(false);  

    useEffect(() => {
      axios('http://localhost:3333/games')
        .then(response => {
          setGames(response.data);
        })
    }, []);

    async function handleCreateAd(event: FormEvent) {
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement);

      const data = Object.fromEntries(formData);

      try {
        await axios.post(`http://localhost:3333/ads/${data.game}`, {
          ...data,
          yearsPlaying: +data.yearsPlaying,
          weekDays: weekDays.map(Number),
          useVoiceChannel
        });

        alert("Anúncio Criado com Sucesso!")
      } catch(err) {
        console.log(err);
      }
    }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed"/>

      <Dialog.Content className="fixed w-[480px] bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg shadow-black/25">
        <Dialog.Title className="text-3xl font-black">Publique seu anúncio</Dialog.Title>
          <form className="mt-8 flex flex-col gap-4" onSubmit={handleCreateAd}>
            <div className="flex flex-col gap-2">
              <label htmlFor="game" className="font-semibold">Qual o game?</label>
              <Select.Root name="game">
                <Select.Trigger className="bg-zinc-900 py-3 px-4 rounded text-sm flex align-center justify-between">
                  <Select.Value placeholder="Selecione o game que deseja jogar"/>
                  <Select.Icon>
                    <CaretDown size={24} className="text-zinc-400"/>
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content>
                  <Select.Viewport className="px-4 bg-zinc-900 text-zinc-400">
                    <Select.Group>
                      {
                        games.map(g => (
                          <Select.Item key={g.id} value={g.id} className="py-1 hover:bg-zinc-700">
                            <Select.ItemText className="text-white">{g.title}</Select.ItemText>
                          </Select.Item>
                        ))
                      }
                    </Select.Group>
                  </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="name">Seu nome (ou nickname)</label>
              <Input id="name" name="name" type="text" placeholder="Como te chamam dentro do game?" /> 
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
                <Input id="yearsPlaying" name="yearsPlaying" type="number" placeholder="Tudo bem ser ZERO" /> 
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="discord">Qual seu discord ?</label>
                <Input id="discord" name="discord" type="text" placeholder="Usuário#0000" /> 
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="weekDays">Quando costuma jogar ?</label>
                  <ToggleGroup.Root type="multiple" className="grid grid-cols-4 gap-2" onValueChange={setWeekDays}>
                    <ToggleGroup.Item value="0" title="Domingo" className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}>D</ToggleGroup.Item>
                    <ToggleGroup.Item value="1" title="Segunda" className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`}>S</ToggleGroup.Item>
                    <ToggleGroup.Item value="2" title="Terça" className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`}>T</ToggleGroup.Item>
                    <ToggleGroup.Item value="3" title="Quarta" className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`}>Q</ToggleGroup.Item>
                    <ToggleGroup.Item value="4" title="Quinta" className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`}>Q</ToggleGroup.Item>
                    <ToggleGroup.Item value="5" title="Sexta" className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`}>S</ToggleGroup.Item>
                    <ToggleGroup.Item value="6" title="Sábado" className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`}>S</ToggleGroup.Item>
                  </ToggleGroup.Root>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="hourStart">Qual horário do dia ?</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input id="hourStart" name="hourStart" type="time" placeholder="De"/>
                  <Input id="hourEnd" name="hourEnd" type="time" placeholder="Até" />
                </div>
              </div>
            </div>

            <label className="mt-2 flex gap-2 text-sm items-center">
              <Checkbox.Root className="w-6 h-6 p-1 rounded bg-zinc-900" checked={useVoiceChannel} onCheckedChange={(checked) => {
                if(checked === true) {
                  setUseVoiceChannel(true);
                } else {
                  setUseVoiceChannel(false);
                }
              }}>
                <Checkbox.Indicator>
                  <Check size={16} className="text-emerald-400"/>
                </Checkbox.Indicator>
              </Checkbox.Root>
              Costumo me conectar ao chat de voz
            </label>

            <footer className="mt-4 flex justify-end gap-4">
              <Dialog.Close className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600 transition-all" type="button">Cancelar</Dialog.Close>
              <button className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600 transition-all" type="submit">
                <GameController size={24}/>
                Encontrar duo
              </button>
            </footer>
          </form>
      </Dialog.Content>
    </Dialog.Portal>
  )
}