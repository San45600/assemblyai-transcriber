"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AssemblyAI, TranscribeParams } from "assemblyai";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FaGithub, FaPause } from "react-icons/fa";
import { IoPlay } from "react-icons/io5";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { MdInfo } from "react-icons/md";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { DragndropZone } from "./DragndropZone";
import { TranscriptText } from "./TranscribedText";
import { Progress } from "./ui/progress";

const speakerCount = Array.from({ length: 6 }, (_, i) => i + 1);

const audioType = ["file", "url"] as const;

type AudioType = (typeof audioType)[number];

const processDesc = [
  "Init...",
  "Uploading...",
  "Fetching...",
  "Finishing...",
  "Done!",
];

type TranscriptType = {
  text: string;
  speaker: string;
  startTime: number;
  endTime: number;
  isFirstText: boolean;
  confidence: number;
};

export default function TranscriberMain() {
  //transcript state
  const [client, setClient] = useState<AssemblyAI>();
  const [speakerNum, setSpeakerNum] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [process, setProcess] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptType[]>();
  const [text, setText] = useState("");

  //audio state
  const audioRef = useRef<HTMLAudioElement>(null);
  const isSliding = useRef(false);
  const [actualTime, setActualTime] = useState(0);
  const [audioTime, setAudioTime] = useState("0:00");
  const [isPlaying, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [inputUrl, setInputUrl] = useState("");
  const [audioInterval, setAudioInterval] = useState<NodeJS.Timeout>();
  const [audioFile, setAudioFile] = useState<File>();
  const [currentAudioType, setCurrentAudioType] = useState<AudioType>("file");

  const intervalFunc = () => {
    if (!isSliding.current) setActualTime(audioRef.current?.currentTime ?? 0);
    const min = Math.floor((audioRef.current?.currentTime ?? 0) / 60);
    const sec = Math.floor((audioRef.current?.currentTime ?? 0) % 60);
    setAudioTime(`${min}:${sec < 10 ? "0" + sec : sec}`);
  };

  const onClickCallback = (time: number) => {
    audioRef.current!.currentTime = (time + 1) / 1000;
    setActualTime((time + 1) / 1000);
    const min = Math.floor((audioRef.current?.currentTime ?? 0) / 60);
    const sec = Math.floor((audioRef.current?.currentTime ?? 0) % 60);
    setAudioTime(`${min}:${sec < 10 ? "0" + sec : sec}`);
  };

  return (
    <div className="w-full bg-[#242424] h-full sm:flex-row flex flex-col py-4 sm:py-12 gap-4 overflow-y-auto">
      <div className="flex flex-col w-full items-center sm:justify-between gap-4 h-full">
        <Card className="w-[90%] bg-[#18181B] border-0 drop-shadow-xl">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                if (!client) throw "AssemblyAI client not exist";
                setProcess(1);
                setPlaying(false);
                audioRef.current?.pause();
                clearInterval(audioInterval);
                let url;
                if (currentAudioType == "file") {
                  if (!audioFile) throw "audio file not exist";
                  const arr = await audioFile.arrayBuffer();
                  const buffer = Buffer.from(arr);
                  const input = {
                    headers: {
                      authorization: apiKey,
                      "Transfer-Encoding": "chunked",
                    },
                    body: buffer,
                    method: "POST",
                  };
                  const json = await fetch(
                    "https://api.assemblyai.com/v2/upload",
                    input
                  ).then((response) => response.json());
                  url = json.upload_url;
                  setAudioUrl(URL.createObjectURL(new Blob([arr])));
                  setProcess((prev) => prev + 1);
                } else {
                  url = inputUrl;
                  setAudioUrl(inputUrl);
                  await new Promise((resolve) => setTimeout(resolve, 500));
                  setProcess((prev) => prev + 1);
                }
                let params: TranscribeParams = {
                  speaker_labels: true,
                  audio_url: url,
                };

                if (speakerNum != 0) {
                  params = { ...params, speakers_expected: speakerNum };
                }

                const transcript = await client.transcripts.transcribe(params);
                if (transcript.status == "error") throw transcript.error;

                let script: TranscriptType[] = [];

                if (!transcript.utterances)
                  throw "Error: missing transcript data";

                transcript.utterances.map((uttVal) => {
                  uttVal.words.map((wordVal, index) => {
                    script.push({
                      text: wordVal.text,
                      speaker: wordVal.speaker ?? "unknown",
                      startTime: wordVal.start,
                      endTime: wordVal.end,
                      isFirstText: index == 0,
                      confidence: wordVal.confidence,
                    });
                  });
                });

                setTranscript(script);
                setText(transcript.text ?? "");
                setProcess((prev) => prev + 1);
              } catch (e) {
                toast.error("Error occurred, check log for more info.");
                console.error(e);
                setProcess(process);
              }

              if (audioRef.current) audioRef.current.currentTime = 0;
              setActualTime(0);
              setAudioTime("0:00");
              await new Promise((resolve) => setTimeout(resolve, 1000));
              setProcess((prev) => prev + 1);
            }}
          >
            <CardHeader className="text-[#F4F4F4]">
              <CardTitle>Transcriber</CardTitle>
              <CardDescription className="text-[#A1A1AA]">
                Transcribing audio file with the help from AssemblyAI!
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 text-xl text-[#f4f4f4]">
                AssemblyAI API key
                <Input
                  placeholder="input here..."
                  value={apiKey}
                  type="password"
                  disabled={process > 0 && process < processDesc.length - 1}
                  className="text-black"
                  onBlur={() => {
                    setClient(new AssemblyAI({ apiKey: apiKey }));
                  }}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                  }}
                />
              </div>

              <div className="text-[#A1A1AA] text-sm flex-wrap flex gap-2 flex-col">
                <div className="text-xl text-[#f4f4f4]">Settings</div>
                <div className="flex flex-col gap-2">
                  <Tabs
                    defaultValue={currentAudioType}
                    onValueChange={(e) => setCurrentAudioType(e as AudioType)}
                    className="h-[120px]"
                  >
                    <TabsList>
                      {audioType.map((val) => (
                        <TabsTrigger key={val} value={val}>
                          Audio {val}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent value="file" className="w-full">
                      <DragndropZone
                        onFileChange={(file) => setAudioFile(file)}
                      />
                    </TabsContent>
                    <TabsContent value="url">
                      <Input
                        placeholder="audio url..."
                        value={inputUrl}
                        disabled={
                          process > 0 && process < processDesc.length - 1
                        }
                        className="text-black"
                        onChange={(e) => {
                          setInputUrl(e.target.value);
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex flex-col gap-2">
                  Total Speakers:
                  <Select
                    onValueChange={(val) => {
                      setSpeakerNum(Number(val));
                    }}
                    defaultValue={"0"}
                    disabled={process > 0 && process < processDesc.length - 1}
                  >
                    <SelectTrigger className="w-[112px] bg-white !min-w-0 text-black">
                      <SelectValue className="text-black" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"0"}>Unknown</SelectItem>
                      {speakerCount.map((val) => (
                        <SelectItem key={val} value={val.toString()}>
                          {val}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-start sm:justify-end gap-2">
              <Button
                variant={"outline"}
                disabled={process > 0 && process < processDesc.length - 1}
                type="submit"
              >
                Start Process
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="w-[90%] bg-[#18181B] border-0 drop-shadow-xl py-4">
          <CardContent className="w-full flex items-center justify-between flex-col gap-4 pb-0">
            <div className=" text-white  flex flex-col gap-2">
              <span className="flex gap-2 w-full justify-center items-center">
                <MdInfo /> Note
              </span>
              <div className="p-2 border-2 rounded-xl text-center h-[92px] flex items-start xl:items-center overflow-y-auto">
                <div className="">
                  If the word is highlighted in
                  <span className="text-red-500 mx-1">red</span>(word not yet
                  played) or
                  <span className="text-yellow-500 mx-1">yellow</span>
                  (word currently playing), it means that word has a high chance
                  of being processed incorrectly, please check carefully.
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-between text-xs sm:text-md md:text-base items-center text-white w-full">
              <div>
                Built with
                <a
                  href="https://www.assemblyai.com/"
                  className="text-[#A1A1AA] hover:text-white mx-1"
                >
                  AssemblyAI
                </a>
              </div>
              <div className="flex gap-2 items-center">
                <a
                  href="https://x.com/HoSan45600"
                  className="text-[#A1A1AA] hover:text-white"
                >
                  San Ho
                </a>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-[#A1A1AA]"
                />
                <a
                  href="https://github.com/San45600/assemblyai-transcriber"
                  className="text-[#A1A1AA] hover:text-white"
                >
                  <FaGithub size={24} />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex justify-center items-center flex-col gap-4 h-full">
        <Card className="w-[90%] bg-[#18181B] border-0 drop-shadow-xl h-full flex flex-col overflow-hidden items-center">
          <CardContent className="w-full h-full pb-0 overflow-y-auto border-b-2 border-[#A1A1AA]">
            {process == 0 ? (
              <div className="flex justify-center items-center text-white h-full flex-col relative">
                The transcript will be shown here.
              </div>
            ) : process > 0 && process < processDesc.length - 1 ? (
              <div className="flex flex-col gap-8 justify-center items-center text-white h-full">
                <CgSpinnerTwoAlt
                  className="animate-spin text-white"
                  size={64}
                />
                <Progress value={(100 / (processDesc.length - 2)) * process} />
                <div>{processDesc[process]}</div>
              </div>
            ) : (
              <div className="text-white h-fit rounded-lg flex gap-[5px] flex-wrap items-center mb-[13px]">
                {transcript &&
                  transcript.map((val: any, index) => {
                    return (
                      <Fragment key={"span_" + index}>
                        {val.isFirstText && (
                          <>
                            <div className=" basis-full mt-2"></div>
                            <span className="h-fit">
                              Speaker {val.speaker}:
                            </span>
                          </>
                        )}
                        <TranscriptText
                          startTime={val.startTime}
                          confidence={val.confidence}
                          time={actualTime}
                          text={val.text}
                          onClickCallback={onClickCallback}
                        />
                      </Fragment>
                    );
                  })}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end py-4 w-full ">
            <Button
              variant={"secondary"}
              disabled={
                !transcript || (process > 0 && process < processDesc.length - 1)
              }
              onClick={() => {
                if (!audioFile) return;
                console.log(transcript);
                const dataNeeded = transcript?.map((val) => {
                  return {
                    text: val.text,
                    speaker: val.speaker,
                    startTime: val.startTime,
                    endTime: val.endTime,
                    confidence: val.confidence,
                  };
                });
                const json = { text: text, chunks: dataNeeded };
                const dataStr =
                  "data:text/json;charset=utf-8," +
                  encodeURIComponent(JSON.stringify(json));
                const a = document.createElement("a");
                a.setAttribute("href", dataStr);
                a.setAttribute("download", audioFile.name + "_transcript.json");
                a.click();
              }}
            >
              Download transcript
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-[90%] h-[100px] bg-[#18181B] border-0 drop-shadow-xl pt-6">
          <CardContent className="w-full flex items-center flex-col gap-2">
            <div className="w-full flex gap-2">
              <div className="flex flex-col justify-center w-full">
                <Slider
                  disabled={process != processDesc.length - 1}
                  aria-label="music progress"
                  step={1}
                  min={0}
                  max={Math.floor(audioRef.current?.duration ?? 0)}
                  onValueChange={(e) => {
                    isSliding.current = true;
                    setActualTime(e[0]);
                  }}
                  onValueCommit={(e) => {
                    isSliding.current = false;
                    audioRef.current!.currentTime = e[0];
                  }}
                  defaultValue={[0]}
                  value={[Math.floor(actualTime)]}
                  className="w-full mt-[19px] "
                />
                <div className="flex flex-row justify-between w-full text-white mt-[1px]">
                  <span>{audioTime}</span>
                  {process != processDesc.length - 1 ? (
                    <span>0:00</span>
                  ) : (
                    <span>
                      {Math.floor((audioRef.current?.duration ?? 0) / 60)}:
                      {Math.floor((audioRef.current?.duration ?? 0) % 60)}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <Button
                  disabled={process != processDesc.length - 1}
                  variant={"custom"}
                  className="text-2xl rounded-full bg-white text-black justify-center items-center min-w-0 w-12 h-12 px-0 "
                  onClick={() => {
                    if (!isPlaying) {
                      if (
                        audioRef.current?.currentTime ==
                        audioRef.current?.duration
                      ) {
                        audioRef.current!.currentTime = 0;
                        audioRef.current?.play();
                        setAudioInterval(setInterval(intervalFunc, 30));
                      } else {
                        audioRef.current?.play();
                        setAudioInterval(setInterval(intervalFunc, 30));
                      }
                      setPlaying(true);
                    } else {
                      audioRef.current?.pause();
                      clearInterval(audioInterval);
                      setPlaying(false);
                    }
                  }}
                >
                  {isPlaying ? (
                    <FaPause className="" />
                  ) : (
                    <IoPlay className="-mr-[3px]" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <audio
        ref={audioRef}
        hidden
        src={audioUrl}
        onEnded={() => setPlaying(false)}
      ></audio>
    </div>
  );
}
