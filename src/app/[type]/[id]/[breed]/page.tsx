import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

interface CatOrDog {
  id: string;
  width: number;
  height: number;
  url: string;
  breeds: Breed[];
  type?: string;
}

interface Breed {
  weight: { imperial: string; metric: string };
  height: { imperial: string; metric: string };
  id: number;
  name: string;
  bred_for: string;
  breed_group: string;
  life_span: string;
  temperament: string;
  reference_image_id: string;
}

export const fetchCache = 'force-no-store';

async function fetchAnimalData(id: string, type: string): Promise<CatOrDog> {
  const url =
    type === "cat"
      ? "https://api.thecatapi.com/v1/images"
      : "https://api.thedogapi.com/v1/images";

      const key =
      type === "cat"
        ? process.env.NEXT_PUBLIC_CAT_API_KEY || ""
        : process.env.NEXT_PUBLIC_DOG_API_KEY || "";

  const response = await fetch(`${url}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key || "",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

async function fetchBreedData(
  breed: string,
  type: string
): Promise<[CatOrDog]> {
  const url =
    type === "cat"
      ? "https://api.thecatapi.com/v1/images/search?limit=4&breed_ids="
      : "https://api.thedogapi.com/v1/images/search?limit=4&breed_ids=";

  const key =
    type === "cat"
      ? process.env.NEXT_PUBLIC_CAT_API_KEY || ""
      : process.env.NEXT_PUBLIC_DOG_API_KEY || "";

  const response = await fetch(`${url}${breed}`, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key || "",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}

export default async function AnimalPage({
  params,
}: {
  params: { id: string; type: string; breed: string };
}) {
  const [animal, breeds] = await Promise.all([
    fetchAnimalData(params.id, params.type),
    fetchBreedData(params.breed, params.type),
  ]);

  return (
    <div className="flex flex-col items-center p-4">
      <Card className="w-full max-w-3xl mb-8">
        <CardHeader>
          <CardTitle>{animal?.breeds[0]?.name}</CardTitle>
          <CardDescription>{animal?.breeds[0]?.breed_group}</CardDescription>
        </CardHeader>
        <Image
          src={animal.url}
          alt={animal.breeds?.[0]?.name || "Unknown Breed"}
          width={500}
          height={500}
          className="object-contain w-full max-h-96"
          priority
        />
        <CardContent>
          <p>Weight: {animal?.breeds[0]?.weight?.metric}</p>
          <p>Height: {animal?.breeds[0]?.height?.metric}</p>
          <p>Bred for: {animal?.breeds[0]?.bred_for}</p>
          <p>Life span: {animal?.breeds[0]?.life_span}</p>
          <p>Temperament: {animal?.breeds[0]?.temperament}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {breeds.map((el) => (
          <div key={el.id} className="w-full">
            <Image
              src={el.url}
              alt={el.breeds[0]?.name || "Unknown Breed"}
              width={500}
              height={500}
              className="object-cover w-full h-60"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}
