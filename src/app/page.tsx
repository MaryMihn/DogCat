import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface Weight {
  imperial: string;
  metric: string;
}
interface Breed {
  weight: Weight;
  id: string;
  name: string;
  temperament: string;
  origin: string;
  country_codes: string;
  country_code: string;
  life_span: string;
  wikipedia_url: string;
}
export interface CatOrDog {
  id: string;
  width: number;
  height: number;
  url: string;
  breeds: Breed[];
  type?: string;
}

async function getCatData() {
  const randomParam = new Date().getTime();
  const response = await fetch(
    `https://api.thecatapi.com/v1/images/search?limit=4&has_breeds=true"&random=${randomParam}`,
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/json",
        "x-api-key":
        process.env.NEXT_PUBLIC_CAT_API_KEY || "",
      },
    }
  );
  const data = await response.json();
  return data.map((item: CatOrDog) => ({ ...item, type: "cat" }));
}

async function getDogData() {
  const randomParam = new Date().getTime();
  const response = await fetch(
    `https://api.thedogapi.com/v1/images/search?limit=5&has_breeds=true"&random=${randomParam}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "x-api-key":
        process.env.NEXT_PUBLIC_DOG_API_KEY || "",
      },
    }
  );
  const data = await response.json();

  return data.map((item: CatOrDog) => ({ ...item, type: "dog" }));
}

export default async function Home() {
  const [dogs, cats] = await Promise.all([getDogData(), getCatData()]);

  const animals = [...dogs, ...cats];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {animals.map((animal: CatOrDog) => (
        <Link
          href={`/${animal.type}/${animal.id}/${animal.breeds?.[0]?.id || ""}`}
          key={animal.id}
        >
          <Card key={animal.id}>
            <Image
              src={animal.url}
              alt={animal.breeds?.[0]?.name || "Unknown Breed"}
              width={400}
              height={300}
              className="object-contain w-full h-48"
              priority
            />
            <CardHeader>
              <CardTitle>
                {animal.breeds?.[0]?.name || "Unknown Breed"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {animal.breeds?.[0]?.temperament || "Temperament not available"}
              </p>

              <p>{animal.breeds?.[0]?.id || "Temperament not available"}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
