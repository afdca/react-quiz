import { getUserType, unauthorized } from "@/testing/mocks/handlers/utils"
import { networkDelay } from "@/utils/network-delay"
import { http, HttpHandler, HttpResponse } from "msw"

const GUEST_ANSWERS_CITIES = {
  bundleId: {
    S: "guest_exam_cities",
  },
  isFreeAccess: {
    N: "1",
  },
  answers: {
    L: [
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Tokyo is the capital of Japan.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Beijing is the capital of China.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Rome is the capital of Italy.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Cairo is the capital of Egypt.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "2",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Washington, D.C. is the capital of the United States.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Canberra is the capital of Australia.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "1",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Brasília is the capital of Brazil.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Moscow is the capital of Russia.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Lisbon is the capital of Portugal.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
              {
                N: "1",
              },
              {
                N: "2",
              },
              {
                N: "3",
              },
            ],
          },
          correctChoicesDetail: {
            S: "All cities listed here are in Spain.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "2",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Pretoria is in South Africa.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "2",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Ottawa is the capital of Canada.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
              {
                N: "1",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Paris and Lyon are cities in France.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Vienna is the capital of Austria.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Brussels is the capital of Belgium.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Bern is the capital of Switzerland.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Athens is the capital of Greece.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "3",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Islamabad is the capital city of Pakistan.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Oslo is the capital of Norway.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [
              {
                N: "0",
              },
            ],
          },
          correctChoicesDetail: {
            S: "Seoul is the capital of South Korea.",
          },
        },
      },
    ],
  },
}

const GUEST_ANSWERS_ANIMALS = {
  bundleId: {
    S: "guest_exam_animals",
  },
  isFreeAccess: { N: "1" },
  answers: {
    L: [
      {
        M: {
          correctChoices: {
            L: [{ N: "0" }],
          },
          correctChoicesDetail: {
            S: "Elephant is the largest land mammal.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "2" }],
          },
          correctChoicesDetail: {
            S: "Penguin is a bird that cannot fly.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "0" }, { N: "2" }],
          },
          correctChoicesDetail: {
            S: "Bottlenose Dolphin and Orca are mammals.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "0" }],
          },
          correctChoicesDetail: {
            S: "A cobra is venomous.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "3" }],
          },
          correctChoicesDetail: {
            S: "Cheetah is known for its speed.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "0" }],
          },
          correctChoicesDetail: {
            S: "Blue Whale is the largest animal in the world.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "0" }],
          },
          correctChoicesDetail: {
            S: "Platypus is an Australian animal that lays eggs.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "0" }],
          },
          correctChoicesDetail: {
            S: "Komodo Dragon is the largest species of lizard.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "0" }, { N: "1" }, { N: "3" }],
          },
          correctChoicesDetail: {
            S: "Penguin, Ostrich, and Kiwi are flightless birds.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "1" }, { N: "2" }, { N: "3" }],
          },
          correctChoicesDetail: {
            S: "Polar Bear, Grizzly Bear, and Kodiak Bear are species of bear.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "1" }, { N: "2" }, { N: "3" }],
          },
          correctChoicesDetail: {
            S: "Octopus, Squid, and Starfish are invertebrates.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "1" }, { N: "3" }],
          },
          correctChoicesDetail: {
            S: "Asian Elephant and Bengal Tiger are native to Asia.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "3" }],
          },
          correctChoicesDetail: {
            S: "Zebra is a close relative of the horse.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "0" }, { N: "1" }, { N: "2" }],
          },
          correctChoicesDetail: {
            S: "Shark, Blue Whale, and Manta Ray are ocean-dwelling animals.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "0" }],
          },
          correctChoicesDetail: {
            S: "Sloth is known for its slow movement.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "1" }, { N: "2" }],
          },
          correctChoicesDetail: {
            S: "Sharks and Crocodiles are apex predators.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "0" }, { N: "1" }, { N: "3" }],
          },
          correctChoicesDetail: {
            S: "Tarantula, Black Widow, and Brown Recluse are venomous spiders.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "0" }, { N: "1" }, { N: "2" }],
          },
          correctChoicesDetail: {
            S: "Koala, Kangaroo, and Wombat are native to Australia.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "0" }],
          },
          correctChoicesDetail: {
            S: "Lion is considered the king of the jungle.",
          },
        },
      },
      {
        M: {
          correctChoices: {
            L: [{ N: "1" }, { N: "2" }, { N: "3" }],
          },
          correctChoicesDetail: {
            S: "Orangutan, Chimpanzee, and Gorilla are classified as great apes.",
          },
        },
      },
    ],
  },
}

const GUEST_ANSWERS_MAP: Record<string, unknown> = {
  guest_exam_cities: GUEST_ANSWERS_CITIES,
  guest_exam_animals: GUEST_ANSWERS_ANIMALS,
}

const PRO_ANSWERS_MAP: Record<string, unknown> = {
  // TODO
}

export function getAnswersHandler(): HttpHandler {
  return http.get("/api/cache/answers/*", async ({ cookies, params }) => {
    await networkDelay(100)
    const userType: "guest" | "pro" | undefined = getUserType(cookies)
    if (!userType) return unauthorized()

    const bundleId = params[0] as string
    const answers = userType === "pro" ? PRO_ANSWERS_MAP[bundleId] : GUEST_ANSWERS_MAP[bundleId]
    return HttpResponse.json({ Items: answers ? [answers] : [] })
  })
}
