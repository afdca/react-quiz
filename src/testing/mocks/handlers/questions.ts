import { getUserType, unauthorized } from "@/testing/mocks/handlers/utils"
import { networkDelay } from "@/utils/network-delay"
import { http, HttpHandler, HttpResponse } from "msw"

const GUEST_QUESTIONS_CITIES = {
  bundleId: {
    S: "guest_exam_cities",
  },
  isFreeAccess: {
    N: "1",
  },
  questions: {
    L: [
      {
        M: {
          choices: {
            L: [
              {
                S: "Tokyo",
              },
              {
                S: "Paris",
              },
              {
                S: "London",
              },
              {
                S: "Berlin",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Japan?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Beijing",
              },
              {
                S: "Shanghai",
              },
              {
                S: "Tokyo",
              },
              {
                S: "Hong Kong",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of China?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Rome",
              },
              {
                S: "Milan",
              },
              {
                S: "Naples",
              },
              {
                S: "Venice",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Italy?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Cairo",
              },
              {
                S: "Lagos",
              },
              {
                S: "Nairobi",
              },
              {
                S: "Accra",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Egypt?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "New York",
              },
              {
                S: "Los Angeles",
              },
              {
                S: "Washington, D.C.",
              },
              {
                S: "Chicago",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of the United States?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Canberra",
              },
              {
                S: "Sydney",
              },
              {
                S: "Melbourne",
              },
              {
                S: "Brisbane",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Australia?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Rio de Janeiro",
              },
              {
                S: "Brasília",
              },
              {
                S: "São Paulo",
              },
              {
                S: "Salvador",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Brazil?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Moscow",
              },
              {
                S: "St. Petersburg",
              },
              {
                S: "Kazan",
              },
              {
                S: "Vladivostok",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Russia?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Lisbon",
              },
              {
                S: "Porto",
              },
              {
                S: "Madrid",
              },
              {
                S: "Barcelona",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Portugal?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Barcelona",
              },
              {
                S: "Madrid",
              },
              {
                S: "Seville",
              },
              {
                S: "Valencia",
              },
            ],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which cities are in Spain?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Buenos Aires",
              },
              {
                S: "Las Vegas",
              },
              {
                S: "Pretoria",
              },
              {
                S: "Chicago",
              },
            ],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which cities are in South Africa?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Toronto",
              },
              {
                S: "Vancouver",
              },
              {
                S: "Ottawa",
              },
              {
                S: "Montreal",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Canada?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Paris",
              },
              {
                S: "Lyon",
              },
              {
                S: "Basel",
              },
              {
                S: "Andorra",
              },
            ],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which cities are in France?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Vienna",
              },
              {
                S: "Salzburg",
              },
              {
                S: "Graz",
              },
              {
                S: "Linz",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Austria?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Brussels",
              },
              {
                S: "Antwerp",
              },
              {
                S: "Bruges",
              },
              {
                S: "Ghent",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Belgium?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Bern",
              },
              {
                S: "Zurich",
              },
              {
                S: "Geneva",
              },
              {
                S: "Basel",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Switzerland?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Athens",
              },
              {
                S: "Thessaloniki",
              },
              {
                S: "Rhodes",
              },
              {
                S: "Crete",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Greece?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Kabul",
              },
              {
                S: "Tehran",
              },
              {
                S: "Baghdad",
              },
              {
                S: "Islamabad",
              },
            ],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which cities are in Pakistan?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Oslo",
              },
              {
                S: "Stockholm",
              },
              {
                S: "Helsinki",
              },
              {
                S: "Copenhagen",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of Norway?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              {
                S: "Seoul",
              },
              {
                S: "Busan",
              },
              {
                S: "Incheon",
              },
              {
                S: "Daegu",
              },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the capital of South Korea?",
          },
        },
      },
    ],
  },
}

const GUEST_QUESTIONS_ANIMALS = {
  bundleId: {
    S: "guest_exam_animals",
  },
  isFreeAccess: {
    N: "1",
  },
  questions: {
    L: [
      {
        M: {
          choices: {
            L: [{ S: "Elephant" }, { S: "Rhino" }, { S: "Giraffe" }, { S: "Hippopotamus" }],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "Which animal is the largest land mammal?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Eagle" }, { S: "Sparrow" }, { S: "Penguin" }, { S: "Falcon" }],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "Which bird cannot fly?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              { S: "Bottlenose Dolphin" },
              { S: "Great White Shark" },
              { S: "Orca" },
              { S: "Manta Ray" },
            ],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which of the following animals are mammals?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Venomous" }, { S: "Non-Venomous" }],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "Is a cobra venomous or non-venomous?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Lynx" }, { S: "Leopard" }, { S: "Jaguar" }, { S: "Cheetah" }],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "Which big cat is known for its speed?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              { S: "Blue Whale" },
              { S: "Great White Shark" },
              { S: "Beluga Whale" },
              { S: "Orca" },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "Which is the largest animal in the world?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Platypus" }, { S: "Kangaroo" }, { S: "Koala" }, { S: "Wallaby" }],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which Australian animals lay eggs?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              { S: "Komodo Dragon" },
              { S: "Crocodile" },
              { S: "Iguana" },
              { S: "Monitor Lizard" },
            ],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "What is the largest species of lizard?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Penguin" }, { S: "Ostrich" }, { S: "Peacock" }, { S: "Kiwi" }],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which birds are flightless?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Tiger" }, { S: "Polar Bear" }, { S: "Grizzly Bear" }, { S: "Kodiak Bear" }],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which are species of bear?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Dolphin" }, { S: "Octopus" }, { S: "Squid" }, { S: "Starfish" }],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which of these animals are invertebrates?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              { S: "African Lion" },
              { S: "Asian Elephant" },
              { S: "Indian Rhino" },
              { S: "Bengal Tiger" },
            ],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which animals are native to Asia?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Horse" }, { S: "Wolf" }, { S: "Donkey" }, { S: "Zebra" }],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "Which animal is a close relative of the horse?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Shark" }, { S: "Blue Whale" }, { S: "Manta Ray" }, { S: "Piranha" }],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which of the following are ocean-dwelling animals?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Sloth" }, { S: "Tiger" }, { S: "Cheetah" }, { S: "Leopard" }],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "Which animal is known for its slow movement?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Snakes" }, { S: "Sharks" }, { S: "Crocodiles" }, { S: "Spiders" }],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which of these animals are considered apex predators?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [
              { S: "Tarantula" },
              { S: "Black Widow" },
              { S: "Daddy Long Legs" },
              { S: "Brown Recluse" },
            ],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which of these spiders are venomous?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Koala" }, { S: "Kangaroo" }, { S: "Wombat" }, { S: "Capybara" }],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which animals are native to Australia?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Lion" }, { S: "Cheetah" }, { S: "Rhino" }, { S: "Giraffe" }],
          },
          multiChoice: {
            BOOL: false,
          },
          questionText: {
            S: "Which animal is considered the king of the jungle?",
          },
        },
      },
      {
        M: {
          choices: {
            L: [{ S: "Ape" }, { S: "Orangutan" }, { S: "Chimpanzee" }, { S: "Gorilla" }],
          },
          multiChoice: {
            BOOL: true,
          },
          questionText: {
            S: "Which of these are classified as great apes?",
          },
        },
      },
    ],
  },
}

const GUEST_QUESTIONS_MAP: Record<string, unknown> = {
  guest_exam_cities: GUEST_QUESTIONS_CITIES,
  guest_exam_animals: GUEST_QUESTIONS_ANIMALS,
}

const PRO_QUESTIONS_MAP: Record<string, unknown> = {
  // TODO
}

export function getQuestionsHandler(): HttpHandler {
  return http.get("/api/cache/questions/*", async ({ cookies, params }) => {
    await networkDelay(100)
    const userType: "guest" | "pro" | undefined = getUserType(cookies)
    if (!userType) return unauthorized()

    const bundleId = params[0] as string
    const questions =
      userType === "pro" ? PRO_QUESTIONS_MAP[bundleId] : GUEST_QUESTIONS_MAP[bundleId]
    return HttpResponse.json({ Items: questions ? [questions] : [] })
  })
}
