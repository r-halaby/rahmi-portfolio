import type { SchemaTypeDefinition } from "sanity";

import { article } from "./article";
import { bio } from "./bio";
import { book } from "./book";
import { future } from "./future";
import { landing } from "./landing";
import { movie } from "./movie";
import { nonprofit } from "./nonprofit";
import { now } from "./now";
import { photo } from "./photo";
import { project } from "./project";
import { skill } from "./skill";
import { tag } from "./tag";
import { talk } from "./talk";
import { wishProject } from "./wishProject";

export const schemaTypes: SchemaTypeDefinition[] = [
  tag,
  skill,
  now,
  bio,
  landing,
  project,
  article,
  movie,
  book,
  talk,
  nonprofit,
  future,
  wishProject,
  photo,
];
