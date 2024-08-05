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
  const [process, setProcess] = useState(4);
  const [transcript, setTranscript] = useState<TranscriptType[]>([
    {
      text: "Hey,",
      speaker: "A",
      startTime: 3360,
      endTime: 3512,
      isFirstText: true,
      confidence: 0.98086,
    },
    {
      text: "I",
      speaker: "A",
      startTime: 3512,
      endTime: 3648,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "want",
      speaker: "A",
      startTime: 3648,
      endTime: 3760,
      isFirstText: false,
      confidence: 0.99974,
    },
    {
      text: "you",
      speaker: "A",
      startTime: 3774,
      endTime: 3878,
      isFirstText: false,
      confidence: 0.99342,
    },
    {
      text: "to",
      speaker: "A",
      startTime: 3894,
      endTime: 4046,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "tell",
      speaker: "A",
      startTime: 4078,
      endTime: 4318,
      isFirstText: false,
      confidence: 0.99909,
    },
    {
      text: "me",
      speaker: "A",
      startTime: 4374,
      endTime: 4662,
      isFirstText: false,
      confidence: 0.99946,
    },
    {
      text: "a",
      speaker: "A",
      startTime: 4726,
      endTime: 4926,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "bunch",
      speaker: "A",
      startTime: 4958,
      endTime: 5166,
      isFirstText: false,
      confidence: 0.92989,
    },
    {
      text: "of",
      speaker: "A",
      startTime: 5198,
      endTime: 5654,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "tongue",
      speaker: "A",
      startTime: 5782,
      endTime: 6206,
      isFirstText: false,
      confidence: 0.98951,
    },
    {
      text: "twisters,",
      speaker: "A",
      startTime: 6238,
      endTime: 6822,
      isFirstText: false,
      confidence: 0.99094,
    },
    {
      text: "but",
      speaker: "A",
      startTime: 6886,
      endTime: 7182,
      isFirstText: false,
      confidence: 0.9978,
    },
    {
      text: "I",
      speaker: "A",
      startTime: 7246,
      endTime: 7446,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "want",
      speaker: "A",
      startTime: 7478,
      endTime: 7646,
      isFirstText: false,
      confidence: 0.99976,
    },
    {
      text: "you",
      speaker: "A",
      startTime: 7678,
      endTime: 7822,
      isFirstText: false,
      confidence: 0.99787,
    },
    {
      text: "to",
      speaker: "A",
      startTime: 7846,
      endTime: 8054,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "take",
      speaker: "A",
      startTime: 8102,
      endTime: 8478,
      isFirstText: false,
      confidence: 0.98907,
    },
    {
      text: "no",
      speaker: "A",
      startTime: 8574,
      endTime: 8902,
      isFirstText: false,
      confidence: 0.54742,
    },
    {
      text: "pauses",
      speaker: "A",
      startTime: 8966,
      endTime: 9414,
      isFirstText: false,
      confidence: 0.70606,
    },
    {
      text: "in",
      speaker: "A",
      startTime: 9462,
      endTime: 9622,
      isFirstText: false,
      confidence: 0.99398,
    },
    {
      text: "between",
      speaker: "A",
      startTime: 9646,
      endTime: 9950,
      isFirstText: false,
      confidence: 0.99979,
    },
    {
      text: "words.",
      speaker: "A",
      startTime: 10030,
      endTime: 10690,
      isFirstText: false,
      confidence: 0.61211,
    },
    {
      text: "Alright?",
      speaker: "B",
      startTime: 11590,
      endTime: 12070,
      isFirstText: true,
      confidence: 0.45934,
    },
    {
      text: "Here",
      speaker: "B",
      startTime: 12110,
      endTime: 12238,
      isFirstText: false,
      confidence: 0.99851,
    },
    {
      text: "we",
      speaker: "B",
      startTime: 12254,
      endTime: 12382,
      isFirstText: false,
      confidence: 0.99789,
    },
    {
      text: "go.",
      speaker: "B",
      startTime: 12406,
      endTime: 12662,
      isFirstText: false,
      confidence: 0.94013,
    },
    {
      text: "How",
      speaker: "B",
      startTime: 12726,
      endTime: 12902,
      isFirstText: false,
      confidence: 0.99774,
    },
    {
      text: "much",
      speaker: "B",
      startTime: 12926,
      endTime: 13062,
      isFirstText: false,
      confidence: 0.99927,
    },
    {
      text: "wood",
      speaker: "B",
      startTime: 13086,
      endTime: 13222,
      isFirstText: false,
      confidence: 0.84985,
    },
    {
      text: "would",
      speaker: "B",
      startTime: 13246,
      endTime: 13334,
      isFirstText: false,
      confidence: 0.97657,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 13342,
      endTime: 13414,
      isFirstText: false,
      confidence: 0.98,
    },
    {
      text: "wood",
      speaker: "B",
      startTime: 13422,
      endTime: 13542,
      isFirstText: false,
      confidence: 0.98533,
    },
    {
      text: "woodchuck",
      speaker: "B",
      startTime: 13566,
      endTime: 13886,
      isFirstText: false,
      confidence: 0.65031,
    },
    {
      text: "chuck",
      speaker: "B",
      startTime: 13918,
      endTime: 14102,
      isFirstText: false,
      confidence: 0.93372,
    },
    {
      text: "if",
      speaker: "B",
      startTime: 14126,
      endTime: 14214,
      isFirstText: false,
      confidence: 0.99583,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 14222,
      endTime: 14294,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "woodchuck",
      speaker: "B",
      startTime: 14302,
      endTime: 14606,
      isFirstText: false,
      confidence: 0.96008,
    },
    {
      text: "could",
      speaker: "B",
      startTime: 14638,
      endTime: 14782,
      isFirstText: false,
      confidence: 0.76673,
    },
    {
      text: "chuck",
      speaker: "B",
      startTime: 14806,
      endTime: 15030,
      isFirstText: false,
      confidence: 0.84512,
    },
    {
      text: "wood?",
      speaker: "B",
      startTime: 15070,
      endTime: 15222,
      isFirstText: false,
      confidence: 0.9409,
    },
    {
      text: "Key",
      speaker: "B",
      startTime: 15246,
      endTime: 15406,
      isFirstText: false,
      confidence: 0.33365,
    },
    {
      text: "sells",
      speaker: "B",
      startTime: 15438,
      endTime: 15638,
      isFirstText: false,
      confidence: 0.79311,
    },
    {
      text: "seashells",
      speaker: "B",
      startTime: 15654,
      endTime: 16038,
      isFirstText: false,
      confidence: 0.92723,
    },
    {
      text: "by",
      speaker: "B",
      startTime: 16054,
      endTime: 16134,
      isFirstText: false,
      confidence: 0.99646,
    },
    {
      text: "the",
      speaker: "B",
      startTime: 16142,
      endTime: 16238,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "seashore.",
      speaker: "B",
      startTime: 16254,
      endTime: 16566,
      isFirstText: false,
      confidence: 0.85506,
    },
    {
      text: "Peter",
      speaker: "B",
      startTime: 16598,
      endTime: 16798,
      isFirstText: false,
      confidence: 0.53835,
    },
    {
      text: "Piper",
      speaker: "B",
      startTime: 16814,
      endTime: 17062,
      isFirstText: false,
      confidence: 0.84202,
    },
    {
      text: "picked",
      speaker: "B",
      startTime: 17086,
      endTime: 17214,
      isFirstText: false,
      confidence: 0.99493,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 17222,
      endTime: 17294,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "pack",
      speaker: "B",
      startTime: 17302,
      endTime: 17398,
      isFirstText: false,
      confidence: 0.86602,
    },
    {
      text: "of",
      speaker: "B",
      startTime: 17414,
      endTime: 17494,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "pickled",
      speaker: "B",
      startTime: 17502,
      endTime: 17702,
      isFirstText: false,
      confidence: 0.93514,
    },
    {
      text: "peppers.",
      speaker: "B",
      startTime: 17726,
      endTime: 17942,
      isFirstText: false,
      confidence: 0.96739,
    },
    {
      text: "How",
      speaker: "B",
      startTime: 17966,
      endTime: 18078,
      isFirstText: false,
      confidence: 0.99858,
    },
    {
      text: "many",
      speaker: "B",
      startTime: 18094,
      endTime: 18222,
      isFirstText: false,
      confidence: 0.99827,
    },
    {
      text: "pack",
      speaker: "B",
      startTime: 18246,
      endTime: 18358,
      isFirstText: false,
      confidence: 0.9483,
    },
    {
      text: "of",
      speaker: "B",
      startTime: 18374,
      endTime: 18454,
      isFirstText: false,
      confidence: 0.94,
    },
    {
      text: "pickled",
      speaker: "B",
      startTime: 18462,
      endTime: 18662,
      isFirstText: false,
      confidence: 0.92155,
    },
    {
      text: "peppers",
      speaker: "B",
      startTime: 18686,
      endTime: 18862,
      isFirstText: false,
      confidence: 0.94394,
    },
    {
      text: "did",
      speaker: "B",
      startTime: 18886,
      endTime: 18998,
      isFirstText: false,
      confidence: 0.99573,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 19014,
      endTime: 19094,
      isFirstText: false,
      confidence: 0.98,
    },
    {
      text: "woodchuck",
      speaker: "B",
      startTime: 19102,
      endTime: 19342,
      isFirstText: false,
      confidence: 0.91002,
    },
    {
      text: "chuck?",
      speaker: "B",
      startTime: 19366,
      endTime: 19502,
      isFirstText: false,
      confidence: 0.79189,
    },
    {
      text: "If",
      speaker: "B",
      startTime: 19526,
      endTime: 19614,
      isFirstText: false,
      confidence: 0.96372,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 19622,
      endTime: 19694,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "woodchuck",
      speaker: "B",
      startTime: 19702,
      endTime: 19942,
      isFirstText: false,
      confidence: 0.97753,
    },
    {
      text: "could",
      speaker: "B",
      startTime: 19966,
      endTime: 20078,
      isFirstText: false,
      confidence: 0.77918,
    },
    {
      text: "chuck",
      speaker: "B",
      startTime: 20094,
      endTime: 20286,
      isFirstText: false,
      confidence: 0.95491,
    },
    {
      text: "wood",
      speaker: "B",
      startTime: 20318,
      endTime: 20534,
      isFirstText: false,
      confidence: 0.9402,
    },
    {
      text: "if",
      speaker: "B",
      startTime: 20582,
      endTime: 20718,
      isFirstText: false,
      confidence: 0.99062,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 20734,
      endTime: 20814,
      isFirstText: false,
      confidence: 0.98,
    },
    {
      text: "woodchuck",
      speaker: "B",
      startTime: 20822,
      endTime: 21086,
      isFirstText: false,
      confidence: 0.94234,
    },
    {
      text: "could",
      speaker: "B",
      startTime: 21118,
      endTime: 21238,
      isFirstText: false,
      confidence: 0.79445,
    },
    {
      text: "chuck",
      speaker: "B",
      startTime: 21254,
      endTime: 21446,
      isFirstText: false,
      confidence: 0.79834,
    },
    {
      text: "wood,",
      speaker: "B",
      startTime: 21478,
      endTime: 21598,
      isFirstText: false,
      confidence: 0.82613,
    },
    {
      text: "the",
      speaker: "B",
      startTime: 21614,
      endTime: 21718,
      isFirstText: false,
      confidence: 0.61,
    },
    {
      text: "couldy",
      speaker: "B",
      startTime: 21734,
      endTime: 21918,
      isFirstText: false,
      confidence: 0.40502,
    },
    {
      text: "chuck",
      speaker: "B",
      startTime: 21934,
      endTime: 22062,
      isFirstText: false,
      confidence: 0.72637,
    },
    {
      text: "chuck",
      speaker: "B",
      startTime: 22086,
      endTime: 22246,
      isFirstText: false,
      confidence: 0.96716,
    },
    {
      text: "would.",
      speaker: "B",
      startTime: 22278,
      endTime: 22398,
      isFirstText: false,
      confidence: 0.52645,
    },
    {
      text: "If",
      speaker: "B",
      startTime: 22414,
      endTime: 22494,
      isFirstText: false,
      confidence: 0.92096,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 22502,
      endTime: 22574,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "woodchuck",
      speaker: "B",
      startTime: 22582,
      endTime: 22822,
      isFirstText: false,
      confidence: 0.98466,
    },
    {
      text: "could",
      speaker: "B",
      startTime: 22846,
      endTime: 22958,
      isFirstText: false,
      confidence: 0.74006,
    },
    {
      text: "chuck",
      speaker: "B",
      startTime: 22974,
      endTime: 23166,
      isFirstText: false,
      confidence: 0.67556,
    },
    {
      text: "wood,",
      speaker: "B",
      startTime: 23198,
      endTime: 23526,
      isFirstText: false,
      confidence: 0.92787,
    },
    {
      text: "how",
      speaker: "B",
      startTime: 23598,
      endTime: 23758,
      isFirstText: false,
      confidence: 0.99153,
    },
    {
      text: "did",
      speaker: "B",
      startTime: 23774,
      endTime: 23878,
      isFirstText: false,
      confidence: 0.97329,
    },
    {
      text: "the",
      speaker: "B",
      startTime: 23894,
      endTime: 23974,
      isFirstText: false,
      confidence: 0.8,
    },
    {
      text: "woodchuck,",
      speaker: "B",
      startTime: 23982,
      endTime: 24222,
      isFirstText: false,
      confidence: 0.91475,
    },
    {
      text: "and",
      speaker: "B",
      startTime: 24246,
      endTime: 24334,
      isFirstText: false,
      confidence: 0.22,
    },
    {
      text: "it",
      speaker: "B",
      startTime: 24342,
      endTime: 24390,
      isFirstText: false,
      confidence: 0.30143,
    },
    {
      text: "was",
      speaker: "B",
      startTime: 24390,
      endTime: 24430,
      isFirstText: false,
      confidence: 0.43073,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 24430,
      endTime: 24470,
      isFirstText: false,
      confidence: 0.74,
    },
    {
      text: "woodchuck",
      speaker: "B",
      startTime: 24470,
      endTime: 24662,
      isFirstText: false,
      confidence: 0.50732,
    },
    {
      text: "away.",
      speaker: "B",
      startTime: 24686,
      endTime: 24798,
      isFirstText: false,
      confidence: 0.33561,
    },
    {
      text: "Did",
      speaker: "B",
      startTime: 24814,
      endTime: 24894,
      isFirstText: false,
      confidence: 0.333,
    },
    {
      text: "he",
      speaker: "B",
      startTime: 24902,
      endTime: 24998,
      isFirstText: false,
      confidence: 0.73898,
    },
    {
      text: "sell",
      speaker: "B",
      startTime: 25014,
      endTime: 25142,
      isFirstText: false,
      confidence: 0.99479,
    },
    {
      text: "seashells?",
      speaker: "B",
      startTime: 25166,
      endTime: 25970,
      isFirstText: false,
      confidence: 0.87917,
    },
    {
      text: "That",
      speaker: "B",
      startTime: 26530,
      endTime: 26890,
      isFirstText: false,
      confidence: 0.99643,
    },
    {
      text: "was",
      speaker: "B",
      startTime: 26930,
      endTime: 27178,
      isFirstText: false,
      confidence: 0.99112,
    },
    {
      text: "definitely",
      speaker: "B",
      startTime: 27234,
      endTime: 27642,
      isFirstText: false,
      confidence: 0.93627,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 27666,
      endTime: 27778,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "mouthful.",
      speaker: "B",
      startTime: 27794,
      endTime: 28470,
      isFirstText: false,
      confidence: 0.82267,
    },
    {
      text: "Did",
      speaker: "B",
      startTime: 28890,
      endTime: 29202,
      isFirstText: false,
      confidence: 0.99848,
    },
    {
      text: "any",
      speaker: "B",
      startTime: 29226,
      endTime: 29362,
      isFirstText: false,
      confidence: 0.99785,
    },
    {
      text: "of",
      speaker: "B",
      startTime: 29386,
      endTime: 29474,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "them",
      speaker: "B",
      startTime: 29482,
      endTime: 29602,
      isFirstText: false,
      confidence: 0.99757,
    },
    {
      text: "trip",
      speaker: "B",
      startTime: 29626,
      endTime: 29802,
      isFirstText: false,
      confidence: 0.97779,
    },
    {
      text: "you",
      speaker: "B",
      startTime: 29826,
      endTime: 29962,
      isFirstText: false,
      confidence: 0.99552,
    },
    {
      text: "up",
      speaker: "B",
      startTime: 29986,
      endTime: 30410,
      isFirstText: false,
      confidence: 0.99836,
    },
    {
      text: "or",
      speaker: "B",
      startTime: 30530,
      endTime: 30834,
      isFirstText: false,
      confidence: 0.99599,
    },
    {
      text: "did",
      speaker: "B",
      startTime: 30882,
      endTime: 31042,
      isFirstText: false,
      confidence: 0.99348,
    },
    {
      text: "you",
      speaker: "B",
      startTime: 31066,
      endTime: 31202,
      isFirstText: false,
      confidence: 0.99635,
    },
    {
      text: "get",
      speaker: "B",
      startTime: 31226,
      endTime: 31362,
      isFirstText: false,
      confidence: 0.9968,
    },
    {
      text: "through",
      speaker: "B",
      startTime: 31386,
      endTime: 31498,
      isFirstText: false,
      confidence: 0.99827,
    },
    {
      text: "them",
      speaker: "B",
      startTime: 31514,
      endTime: 31642,
      isFirstText: false,
      confidence: 0.75171,
    },
    {
      text: "all",
      speaker: "B",
      startTime: 31666,
      endTime: 31826,
      isFirstText: false,
      confidence: 0.99911,
    },
    {
      text: "smoothly?",
      speaker: "B",
      startTime: 31858,
      endTime: 32706,
      isFirstText: false,
      confidence: 0.8045,
    },
    {
      text: "Okay,",
      speaker: "A",
      startTime: 32898,
      endTime: 33322,
      isFirstText: true,
      confidence: 0.57939,
    },
    {
      text: "I",
      speaker: "A",
      startTime: 33346,
      endTime: 33482,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "want",
      speaker: "A",
      startTime: 33506,
      endTime: 33618,
      isFirstText: false,
      confidence: 0.99925,
    },
    {
      text: "you",
      speaker: "A",
      startTime: 33634,
      endTime: 33738,
      isFirstText: false,
      confidence: 0.99211,
    },
    {
      text: "to",
      speaker: "A",
      startTime: 33754,
      endTime: 33882,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "do",
      speaker: "A",
      startTime: 33906,
      endTime: 33994,
      isFirstText: false,
      confidence: 0.99692,
    },
    {
      text: "it",
      speaker: "A",
      startTime: 34002,
      endTime: 34122,
      isFirstText: false,
      confidence: 0.99136,
    },
    {
      text: "again,",
      speaker: "A",
      startTime: 34146,
      endTime: 34426,
      isFirstText: false,
      confidence: 0.99512,
    },
    {
      text: "but",
      speaker: "A",
      startTime: 34498,
      endTime: 34778,
      isFirstText: false,
      confidence: 0.98129,
    },
    {
      text: "way",
      speaker: "A",
      startTime: 34834,
      endTime: 35074,
      isFirstText: false,
      confidence: 0.99184,
    },
    {
      text: "faster",
      speaker: "A",
      startTime: 35122,
      endTime: 35626,
      isFirstText: false,
      confidence: 0.81862,
    },
    {
      text: "and",
      speaker: "A",
      startTime: 35738,
      endTime: 36058,
      isFirstText: false,
      confidence: 0.97,
    },
    {
      text: "without",
      speaker: "A",
      startTime: 36114,
      endTime: 36498,
      isFirstText: false,
      confidence: 0.99919,
    },
    {
      text: "taking",
      speaker: "A",
      startTime: 36594,
      endTime: 36994,
      isFirstText: false,
      confidence: 0.99395,
    },
    {
      text: "any",
      speaker: "A",
      startTime: 37082,
      endTime: 37354,
      isFirstText: false,
      confidence: 0.9791,
    },
    {
      text: "breaths",
      speaker: "A",
      startTime: 37402,
      endTime: 37850,
      isFirstText: false,
      confidence: 0.73472,
    },
    {
      text: "or",
      speaker: "A",
      startTime: 37890,
      endTime: 38066,
      isFirstText: false,
      confidence: 0.98028,
    },
    {
      text: "pauses.",
      speaker: "A",
      startTime: 38098,
      endTime: 38870,
      isFirstText: false,
      confidence: 0.79608,
    },
    {
      text: "I",
      speaker: "B",
      startTime: 39850,
      endTime: 40162,
      isFirstText: true,
      confidence: 1,
    },
    {
      text: "wish",
      speaker: "B",
      startTime: 40186,
      endTime: 40346,
      isFirstText: false,
      confidence: 0.99679,
    },
    {
      text: "I",
      speaker: "B",
      startTime: 40378,
      endTime: 40522,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "could,",
      speaker: "B",
      startTime: 40546,
      endTime: 40778,
      isFirstText: false,
      confidence: 0.9999,
    },
    {
      text: "but",
      speaker: "B",
      startTime: 40834,
      endTime: 41098,
      isFirstText: false,
      confidence: 0.99357,
    },
    {
      text: "I",
      speaker: "B",
      startTime: 41154,
      endTime: 41346,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "need",
      speaker: "B",
      startTime: 41378,
      endTime: 41522,
      isFirstText: false,
      confidence: 0.99975,
    },
    {
      text: "to",
      speaker: "B",
      startTime: 41546,
      endTime: 41682,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "breathe",
      speaker: "B",
      startTime: 41706,
      endTime: 42042,
      isFirstText: false,
      confidence: 0.9317,
    },
    {
      text: "just",
      speaker: "B",
      startTime: 42066,
      endTime: 42250,
      isFirstText: false,
      confidence: 0.98516,
    },
    {
      text: "like",
      speaker: "B",
      startTime: 42290,
      endTime: 42442,
      isFirstText: false,
      confidence: 0.99796,
    },
    {
      text: "anybody",
      speaker: "B",
      startTime: 42466,
      endTime: 42826,
      isFirstText: false,
      confidence: 0.87655,
    },
    {
      text: "speaking.",
      speaker: "B",
      startTime: 42858,
      endTime: 43470,
      isFirstText: false,
      confidence: 0.87312,
    },
    {
      text: "Want",
      speaker: "B",
      startTime: 43770,
      endTime: 44082,
      isFirstText: false,
      confidence: 0.64691,
    },
    {
      text: "to",
      speaker: "B",
      startTime: 44106,
      endTime: 44194,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "give",
      speaker: "B",
      startTime: 44202,
      endTime: 44274,
      isFirstText: false,
      confidence: 0.99915,
    },
    {
      text: "it",
      speaker: "B",
      startTime: 44282,
      endTime: 44354,
      isFirstText: false,
      confidence: 0.99381,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 44362,
      endTime: 44458,
      isFirstText: false,
      confidence: 0.8,
    },
    {
      text: "shot",
      speaker: "B",
      startTime: 44474,
      endTime: 44626,
      isFirstText: false,
      confidence: 0.99807,
    },
    {
      text: "yourself",
      speaker: "B",
      startTime: 44658,
      endTime: 44994,
      isFirstText: false,
      confidence: 0.99395,
    },
    {
      text: "and",
      speaker: "B",
      startTime: 45042,
      endTime: 45226,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "see",
      speaker: "B",
      startTime: 45258,
      endTime: 45378,
      isFirstText: false,
      confidence: 0.99745,
    },
    {
      text: "how",
      speaker: "B",
      startTime: 45394,
      endTime: 45522,
      isFirstText: false,
      confidence: 0.99938,
    },
    {
      text: "fast",
      speaker: "B",
      startTime: 45546,
      endTime: 45730,
      isFirstText: false,
      confidence: 0.95452,
    },
    {
      text: "you",
      speaker: "B",
      startTime: 45770,
      endTime: 45874,
      isFirstText: false,
      confidence: 0.99812,
    },
    {
      text: "can",
      speaker: "B",
      startTime: 45882,
      endTime: 46002,
      isFirstText: false,
      confidence: 0.99682,
    },
    {
      text: "go?",
      speaker: "B",
      startTime: 46026,
      endTime: 46590,
      isFirstText: false,
      confidence: 0.99876,
    },
    {
      text: "Okay.",
      speaker: "A",
      startTime: 47130,
      endTime: 47586,
      isFirstText: true,
      confidence: 0.70714,
    },
    {
      text: "Well",
      speaker: "A",
      startTime: 47618,
      endTime: 47786,
      isFirstText: false,
      confidence: 0.93449,
    },
    {
      text: "then",
      speaker: "A",
      startTime: 47818,
      endTime: 48034,
      isFirstText: false,
      confidence: 0.99003,
    },
    {
      text: "go",
      speaker: "A",
      startTime: 48082,
      endTime: 48266,
      isFirstText: false,
      confidence: 0.98784,
    },
    {
      text: "ahead",
      speaker: "A",
      startTime: 48298,
      endTime: 48514,
      isFirstText: false,
      confidence: 0.9965,
    },
    {
      text: "and",
      speaker: "A",
      startTime: 48562,
      endTime: 49154,
      isFirstText: false,
      confidence: 0.98,
    },
    {
      text: "tell",
      speaker: "A",
      startTime: 49322,
      endTime: 49626,
      isFirstText: false,
      confidence: 0.99918,
    },
    {
      text: "me",
      speaker: "A",
      startTime: 49658,
      endTime: 49898,
      isFirstText: false,
      confidence: 0.99489,
    },
    {
      text: "more",
      speaker: "A",
      startTime: 49954,
      endTime: 50170,
      isFirstText: false,
      confidence: 0.99628,
    },
    {
      text: "tongue",
      speaker: "A",
      startTime: 50210,
      endTime: 50482,
      isFirstText: false,
      confidence: 0.94708,
    },
    {
      text: "twisters",
      speaker: "A",
      startTime: 50506,
      endTime: 50930,
      isFirstText: false,
      confidence: 0.98472,
    },
    {
      text: "without",
      speaker: "A",
      startTime: 50970,
      endTime: 51242,
      isFirstText: false,
      confidence: 0.99672,
    },
    {
      text: "taking",
      speaker: "A",
      startTime: 51306,
      endTime: 51578,
      isFirstText: false,
      confidence: 0.99694,
    },
    {
      text: "pauses.",
      speaker: "A",
      startTime: 51634,
      endTime: 52350,
      isFirstText: false,
      confidence: 0.55298,
    },
    {
      text: "Sure",
      speaker: "B",
      startTime: 52830,
      endTime: 53190,
      isFirstText: true,
      confidence: 0.99419,
    },
    {
      text: "thing.",
      speaker: "B",
      startTime: 53230,
      endTime: 53574,
      isFirstText: false,
      confidence: 0.9855,
    },
    {
      text: "Fuzzy",
      speaker: "B",
      startTime: 53662,
      endTime: 53982,
      isFirstText: false,
      confidence: 0.62839,
    },
    {
      text: "wuzzy",
      speaker: "B",
      startTime: 54006,
      endTime: 54262,
      isFirstText: false,
      confidence: 0.59293,
    },
    {
      text: "was",
      speaker: "B",
      startTime: 54286,
      endTime: 54398,
      isFirstText: false,
      confidence: 0.99563,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 54414,
      endTime: 54494,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "bear.",
      speaker: "B",
      startTime: 54502,
      endTime: 54686,
      isFirstText: false,
      confidence: 0.99547,
    },
    {
      text: "Fuzzy",
      speaker: "B",
      startTime: 54718,
      endTime: 54982,
      isFirstText: false,
      confidence: 0.32481,
    },
    {
      text: "wuzzy",
      speaker: "B",
      startTime: 55006,
      endTime: 55262,
      isFirstText: false,
      confidence: 0.73314,
    },
    {
      text: "wasn't",
      speaker: "B",
      startTime: 55286,
      endTime: 55502,
      isFirstText: false,
      confidence: 0.52251,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 55526,
      endTime: 55614,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "very",
      speaker: "B",
      startTime: 55622,
      endTime: 55790,
      isFirstText: false,
      confidence: 0.9989,
    },
    {
      text: "good",
      speaker: "B",
      startTime: 55830,
      endTime: 55982,
      isFirstText: false,
      confidence: 0.99972,
    },
    {
      text: "bear.",
      speaker: "B",
      startTime: 56006,
      endTime: 56166,
      isFirstText: false,
      confidence: 0.95287,
    },
    {
      text: "Fuzzy",
      speaker: "B",
      startTime: 56198,
      endTime: 56462,
      isFirstText: false,
      confidence: 0.83295,
    },
    {
      text: "wuzzy",
      speaker: "B",
      startTime: 56486,
      endTime: 56702,
      isFirstText: false,
      confidence: 0.87954,
    },
    {
      text: "wasn't",
      speaker: "B",
      startTime: 56726,
      endTime: 56902,
      isFirstText: false,
      confidence: 0.63702,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 56926,
      endTime: 57014,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "very",
      speaker: "B",
      startTime: 57022,
      endTime: 57166,
      isFirstText: false,
      confidence: 0.99858,
    },
    {
      text: "fuzzy",
      speaker: "B",
      startTime: 57198,
      endTime: 57446,
      isFirstText: false,
      confidence: 0.75069,
    },
    {
      text: "wuzzy.",
      speaker: "B",
      startTime: 57478,
      endTime: 58030,
      isFirstText: false,
      confidence: 0.65469,
    },
    {
      text: "How",
      speaker: "B",
      startTime: 58150,
      endTime: 58382,
      isFirstText: false,
      confidence: 0.99959,
    },
    {
      text: "can",
      speaker: "B",
      startTime: 58406,
      endTime: 58518,
      isFirstText: false,
      confidence: 0.99612,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 58534,
      endTime: 58638,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "clam",
      speaker: "B",
      startTime: 58654,
      endTime: 58870,
      isFirstText: false,
      confidence: 0.98699,
    },
    {
      text: "cram",
      speaker: "B",
      startTime: 58910,
      endTime: 59126,
      isFirstText: false,
      confidence: 0.97567,
    },
    {
      text: "in",
      speaker: "B",
      startTime: 59158,
      endTime: 59278,
      isFirstText: false,
      confidence: 0.65774,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 59294,
      endTime: 59374,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "clean",
      speaker: "B",
      startTime: 59382,
      endTime: 59566,
      isFirstText: false,
      confidence: 0.98832,
    },
    {
      text: "cream",
      speaker: "B",
      startTime: 59598,
      endTime: 59806,
      isFirstText: false,
      confidence: 0.97415,
    },
    {
      text: "can?",
      speaker: "B",
      startTime: 59838,
      endTime: 60222,
      isFirstText: false,
      confidence: 0.9441,
    },
    {
      text: "Six",
      speaker: "B",
      startTime: 60326,
      endTime: 60590,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "slippery",
      speaker: "B",
      startTime: 60630,
      endTime: 60950,
      isFirstText: false,
      confidence: 0.57943,
    },
    {
      text: "snails",
      speaker: "B",
      startTime: 60990,
      endTime: 61278,
      isFirstText: false,
      confidence: 0.46625,
    },
    {
      text: "slid",
      speaker: "B",
      startTime: 61294,
      endTime: 61526,
      isFirstText: false,
      confidence: 0.49314,
    },
    {
      text: "slowly",
      speaker: "B",
      startTime: 61558,
      endTime: 61862,
      isFirstText: false,
      confidence: 0.98209,
    },
    {
      text: "seaward.",
      speaker: "B",
      startTime: 61886,
      endTime: 62390,
      isFirstText: false,
      confidence: 0.95017,
    },
    {
      text: "Betty",
      speaker: "B",
      startTime: 62470,
      endTime: 62782,
      isFirstText: false,
      confidence: 0.49262,
    },
    {
      text: "botter",
      speaker: "B",
      startTime: 62806,
      endTime: 63086,
      isFirstText: false,
      confidence: 0.33496,
    },
    {
      text: "bought",
      speaker: "B",
      startTime: 63118,
      endTime: 63278,
      isFirstText: false,
      confidence: 0.9906,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 63294,
      endTime: 63374,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "bit",
      speaker: "B",
      startTime: 63382,
      endTime: 63478,
      isFirstText: false,
      confidence: 0.99963,
    },
    {
      text: "of",
      speaker: "B",
      startTime: 63494,
      endTime: 63598,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "butter,",
      speaker: "B",
      startTime: 63614,
      endTime: 63846,
      isFirstText: false,
      confidence: 0.99944,
    },
    {
      text: "but",
      speaker: "B",
      startTime: 63878,
      endTime: 63974,
      isFirstText: false,
      confidence: 0.998,
    },
    {
      text: "the",
      speaker: "B",
      startTime: 63982,
      endTime: 64078,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "butter",
      speaker: "B",
      startTime: 64094,
      endTime: 64302,
      isFirstText: false,
      confidence: 0.99904,
    },
    {
      text: "was",
      speaker: "B",
      startTime: 64326,
      endTime: 64462,
      isFirstText: false,
      confidence: 0.99817,
    },
    {
      text: "too",
      speaker: "B",
      startTime: 64486,
      endTime: 64622,
      isFirstText: false,
      confidence: 0.99875,
    },
    {
      text: "bitter.",
      speaker: "B",
      startTime: 64646,
      endTime: 64958,
      isFirstText: false,
      confidence: 0.99988,
    },
    {
      text: "So",
      speaker: "B",
      startTime: 65014,
      endTime: 65182,
      isFirstText: false,
      confidence: 0.99866,
    },
    {
      text: "she",
      speaker: "B",
      startTime: 65206,
      endTime: 65318,
      isFirstText: false,
      confidence: 0.99881,
    },
    {
      text: "bought",
      speaker: "B",
      startTime: 65334,
      endTime: 65478,
      isFirstText: false,
      confidence: 0.98154,
    },
    {
      text: "a",
      speaker: "B",
      startTime: 65494,
      endTime: 65598,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "new",
      speaker: "B",
      startTime: 65614,
      endTime: 65718,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "bit",
      speaker: "B",
      startTime: 65734,
      endTime: 65838,
      isFirstText: false,
      confidence: 0.99207,
    },
    {
      text: "of",
      speaker: "B",
      startTime: 65854,
      endTime: 65934,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "butter",
      speaker: "B",
      startTime: 65942,
      endTime: 66142,
      isFirstText: false,
      confidence: 0.99924,
    },
    {
      text: "to",
      speaker: "B",
      startTime: 66166,
      endTime: 66302,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "make",
      speaker: "B",
      startTime: 66326,
      endTime: 66414,
      isFirstText: false,
      confidence: 0.99951,
    },
    {
      text: "the",
      speaker: "B",
      startTime: 66422,
      endTime: 66518,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "bitter",
      speaker: "B",
      startTime: 66534,
      endTime: 66742,
      isFirstText: false,
      confidence: 0.9971,
    },
    {
      text: "butter",
      speaker: "B",
      startTime: 66766,
      endTime: 66990,
      isFirstText: false,
      confidence: 0.68302,
    },
    {
      text: "better.",
      speaker: "B",
      startTime: 67030,
      endTime: 67610,
      isFirstText: false,
      confidence: 0.99862,
    },
    {
      text: "Okay,",
      speaker: "A",
      startTime: 68550,
      endTime: 69006,
      isFirstText: true,
      confidence: 0.43722,
    },
    {
      text: "do",
      speaker: "A",
      startTime: 69038,
      endTime: 69158,
      isFirstText: false,
      confidence: 0.99922,
    },
    {
      text: "it",
      speaker: "A",
      startTime: 69174,
      endTime: 69278,
      isFirstText: false,
      confidence: 0.99913,
    },
    {
      text: "again.",
      speaker: "A",
      startTime: 69294,
      endTime: 69494,
      isFirstText: false,
      confidence: 0.99937,
    },
    {
      text: "But",
      speaker: "A",
      startTime: 69542,
      endTime: 69726,
      isFirstText: false,
      confidence: 0.99475,
    },
    {
      text: "now",
      speaker: "A",
      startTime: 69758,
      endTime: 69902,
      isFirstText: false,
      confidence: 0.9978,
    },
    {
      text: "I",
      speaker: "A",
      startTime: 69926,
      endTime: 70086,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "want",
      speaker: "A",
      startTime: 70118,
      endTime: 70406,
      isFirstText: false,
      confidence: 0.99789,
    },
    {
      text: "no",
      speaker: "A",
      startTime: 70478,
      endTime: 70710,
      isFirstText: false,
      confidence: 0.99912,
    },
    {
      text: "pauses",
      speaker: "A",
      startTime: 70750,
      endTime: 71134,
      isFirstText: false,
      confidence: 0.87476,
    },
    {
      text: "whatsoever",
      speaker: "A",
      startTime: 71182,
      endTime: 71814,
      isFirstText: false,
      confidence: 0.89818,
    },
    {
      text: "in",
      speaker: "A",
      startTime: 71902,
      endTime: 72102,
      isFirstText: false,
      confidence: 0.99646,
    },
    {
      text: "between",
      speaker: "A",
      startTime: 72126,
      endTime: 72574,
      isFirstText: false,
      confidence: 0.99971,
    },
    {
      text: "the",
      speaker: "A",
      startTime: 72702,
      endTime: 73302,
      isFirstText: false,
      confidence: 0.99,
    },
    {
      text: "tongue",
      speaker: "A",
      startTime: 73446,
      endTime: 73782,
      isFirstText: false,
      confidence: 0.99378,
    },
    {
      text: "twisters",
      speaker: "A",
      startTime: 73806,
      endTime: 74326,
      isFirstText: false,
      confidence: 0.99367,
    },
    {
      text: "and",
      speaker: "A",
      startTime: 74398,
      endTime: 74702,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "in",
      speaker: "A",
      startTime: 74766,
      endTime: 74942,
      isFirstText: false,
      confidence: 0.99249,
    },
    {
      text: "between",
      speaker: "A",
      startTime: 74966,
      endTime: 75222,
      isFirstText: false,
      confidence: 0.99985,
    },
    {
      text: "words.",
      speaker: "A",
      startTime: 75286,
      endTime: 75970,
      isFirstText: false,
      confidence: 0.99419,
    },
    {
      text: "I've",
      speaker: "B",
      startTime: 76670,
      endTime: 76998,
      isFirstText: true,
      confidence: 0.93046,
    },
    {
      text: "gotta",
      speaker: "B",
      startTime: 77014,
      endTime: 77262,
      isFirstText: false,
      confidence: 0.28093,
    },
    {
      text: "take",
      speaker: "B",
      startTime: 77286,
      endTime: 77446,
      isFirstText: false,
      confidence: 0.99968,
    },
    {
      text: "breaths",
      speaker: "B",
      startTime: 77478,
      endTime: 78068,
      isFirstText: false,
      confidence: 0.79369,
    },
    {
      text: "and",
      speaker: "B",
      startTime: 78174,
      endTime: 78440,
      isFirstText: false,
      confidence: 0.95,
    },
    {
      text: "pauses",
      speaker: "B",
      startTime: 78480,
      endTime: 78952,
      isFirstText: false,
      confidence: 0.55026,
    },
    {
      text: "just",
      speaker: "B",
      startTime: 79016,
      endTime: 79240,
      isFirstText: false,
      confidence: 0.99783,
    },
    {
      text: "like",
      speaker: "B",
      startTime: 79280,
      endTime: 79456,
      isFirstText: false,
      confidence: 0.99968,
    },
    {
      text: "anyone",
      speaker: "B",
      startTime: 79488,
      endTime: 79712,
      isFirstText: false,
      confidence: 0.9977,
    },
    {
      text: "else,",
      speaker: "B",
      startTime: 79736,
      endTime: 79920,
      isFirstText: false,
      confidence: 0.99599,
    },
    {
      text: "speaking",
      speaker: "B",
      startTime: 79960,
      endTime: 80200,
      isFirstText: false,
      confidence: 0.99794,
    },
    {
      text: "out",
      speaker: "B",
      startTime: 80240,
      endTime: 80416,
      isFirstText: false,
      confidence: 0.99773,
    },
    {
      text: "loud.",
      speaker: "B",
      startTime: 80448,
      endTime: 81020,
      isFirstText: false,
      confidence: 0.96039,
    },
    {
      text: "But",
      speaker: "B",
      startTime: 81480,
      endTime: 81768,
      isFirstText: false,
      confidence: 0.99352,
    },
    {
      text: "it's",
      speaker: "B",
      startTime: 81784,
      endTime: 81912,
      isFirstText: false,
      confidence: 0.54673,
    },
    {
      text: "your",
      speaker: "B",
      startTime: 81936,
      endTime: 82072,
      isFirstText: false,
      confidence: 0.99788,
    },
    {
      text: "turn",
      speaker: "B",
      startTime: 82096,
      endTime: 82232,
      isFirstText: false,
      confidence: 0.99996,
    },
    {
      text: "to",
      speaker: "B",
      startTime: 82256,
      endTime: 82368,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "try",
      speaker: "B",
      startTime: 82384,
      endTime: 82560,
      isFirstText: false,
      confidence: 0.99974,
    },
    {
      text: "if",
      speaker: "B",
      startTime: 82600,
      endTime: 82728,
      isFirstText: false,
      confidence: 0.98778,
    },
    {
      text: "you're",
      speaker: "B",
      startTime: 82744,
      endTime: 82848,
      isFirstText: false,
      confidence: 0.90882,
    },
    {
      text: "upset.",
      speaker: "B",
      startTime: 82864,
      endTime: 83016,
      isFirstText: false,
      confidence: 0.19297,
    },
    {
      text: "No,",
      speaker: "A",
      startTime: 83048,
      endTime: 83216,
      isFirstText: true,
      confidence: 0.9727,
    },
    {
      text: "no,",
      speaker: "A",
      startTime: 83248,
      endTime: 83776,
      isFirstText: false,
      confidence: 0.67647,
    },
    {
      text: "do",
      speaker: "A",
      startTime: 83928,
      endTime: 84264,
      isFirstText: false,
      confidence: 0.9449,
    },
    {
      text: "try.",
      speaker: "A",
      startTime: 84312,
      endTime: 84952,
      isFirstText: false,
      confidence: 0.99911,
    },
    {
      text: "Try",
      speaker: "A",
      startTime: 85136,
      endTime: 85576,
      isFirstText: false,
      confidence: 0.86723,
    },
    {
      text: "with",
      speaker: "A",
      startTime: 85648,
      endTime: 85832,
      isFirstText: false,
      confidence: 0.99561,
    },
    {
      text: "no",
      speaker: "A",
      startTime: 85856,
      endTime: 86016,
      isFirstText: false,
      confidence: 0.99885,
    },
    {
      text: "pauses.",
      speaker: "A",
      startTime: 86048,
      endTime: 86860,
      isFirstText: false,
      confidence: 0.99458,
    },
    {
      text: "Well,",
      speaker: "B",
      startTime: 87480,
      endTime: 87960,
      isFirstText: true,
      confidence: 0.99611,
    },
    {
      text: "here's",
      speaker: "B",
      startTime: 88040,
      endTime: 88272,
      isFirstText: false,
      confidence: 0.80472,
    },
    {
      text: "the",
      speaker: "B",
      startTime: 88296,
      endTime: 88432,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "thing.",
      speaker: "B",
      startTime: 88456,
      endTime: 88928,
      isFirstText: false,
      confidence: 0.83727,
    },
    {
      text: "I",
      speaker: "B",
      startTime: 89064,
      endTime: 89312,
      isFirstText: false,
      confidence: 1,
    },
    {
      text: "can't",
      speaker: "B",
      startTime: 89336,
      endTime: 89584,
      isFirstText: false,
      confidence: 0.59649,
    },
    {
      text: "actually",
      speaker: "B",
      startTime: 89632,
      endTime: 89936,
      isFirstText: false,
      confidence: 0.99741,
    },
    {
      text: "speak",
      speaker: "B",
      startTime: 90008,
      endTime: 90256,
      isFirstText: false,
      confidence: 0.99965,
    },
    {
      text: "without",
      speaker: "B",
      startTime: 90288,
      endTime: 90504,
      isFirstText: false,
      confidence: 0.99716,
    },
    {
      text: "pauses",
      speaker: "B",
      startTime: 90552,
      endTime: 90896,
      isFirstText: false,
      confidence: 0.92532,
    },
    {
      text: "or",
      speaker: "B",
      startTime: 90928,
      endTime: 91072,
      isFirstText: false,
      confidence: 0.99603,
    },
    {
      text: "breaths.",
      speaker: "B",
      startTime: 91096,
      endTime: 91648,
      isFirstText: false,
      confidence: 0.6844,
    },
    {
      text: "It's",
      speaker: "B",
      startTime: 91744,
      endTime: 92040,
      isFirstText: false,
      confidence: 0.57878,
    },
    {
      text: "just",
      speaker: "B",
      startTime: 92080,
      endTime: 92256,
      isFirstText: false,
      confidence: 0.99941,
    },
    {
      text: "how",
      speaker: "B",
      startTime: 92288,
      endTime: 92456,
      isFirstText: false,
      confidence: 0.98447,
    },
    {
      text: "talking",
      speaker: "B",
      startTime: 92488,
      endTime: 92800,
      isFirstText: false,
      confidence: 0.99885,
    },
    {
      text: "works.",
      speaker: "B",
      startTime: 92840,
      endTime: 93408,
      isFirstText: false,
      confidence: 0.9968,
    },
    {
      text: "But",
      speaker: "B",
      startTime: 93544,
      endTime: 93768,
      isFirstText: false,
      confidence: 0.99483,
    },
    {
      text: "I",
      speaker: "B",
      startTime: 93784,
      endTime: 93864,
      isFirstText: false,
      confidence: 0.93,
    },
    {
      text: "bet",
      speaker: "B",
      startTime: 93872,
      endTime: 93992,
      isFirstText: false,
      confidence: 0.89963,
    },
    {
      text: "you",
      speaker: "B",
      startTime: 94016,
      endTime: 94128,
      isFirstText: false,
      confidence: 0.99975,
    },
    {
      text: "can",
      speaker: "B",
      startTime: 94144,
      endTime: 94248,
      isFirstText: false,
      confidence: 0.58386,
    },
    {
      text: "have",
      speaker: "B",
      startTime: 94264,
      endTime: 94392,
      isFirstText: false,
      confidence: 0.99786,
    },
    {
      text: "some",
      speaker: "B",
      startTime: 94416,
      endTime: 94552,
      isFirstText: false,
      confidence: 0.98971,
    },
    {
      text: "fun",
      speaker: "B",
      startTime: 94576,
      endTime: 94784,
      isFirstText: false,
      confidence: 0.99944,
    },
    {
      text: "trying",
      speaker: "B",
      startTime: 94832,
      endTime: 95064,
      isFirstText: false,
      confidence: 0.99894,
    },
    {
      text: "those",
      speaker: "B",
      startTime: 95112,
      endTime: 95272,
      isFirstText: false,
      confidence: 0.99212,
    },
    {
      text: "tongue",
      speaker: "B",
      startTime: 95296,
      endTime: 95472,
      isFirstText: false,
      confidence: 0.99239,
    },
    {
      text: "twisters",
      speaker: "B",
      startTime: 95496,
      endTime: 95832,
      isFirstText: false,
      confidence: 0.99446,
    },
    {
      text: "yourself.",
      speaker: "B",
      startTime: 95856,
      endTime: 96040,
      isFirstText: false,
      confidence: 0.93162,
    },
  ]);
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
                      disabled={process > 0 && process < processDesc.length - 1}
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
              onClick={async () => {
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

                  const transcript = await client.transcripts.transcribe(
                    params
                  );
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
                  return;
                }

                if (audioRef.current) audioRef.current.currentTime = 0;
                setActualTime(0);
                setAudioTime("0:00");
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setProcess((prev) => prev + 1);
              }}
            >
              Start Process
            </Button>
          </CardFooter>
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
