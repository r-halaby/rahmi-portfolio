import type { SchemaTypeDefinition } from "sanity";

import { album } from "./album";
import { article } from "./article";
import { bio } from "./bio";
import { book } from "./book";
import { future } from "./future";
import { landing } from "./landing";
import { mix } from "./mix";
import { movie } from "./movie";
import { nonprofit } from "./nonprofit";
import { now } from "./now";
import { photo } from "./photo";
import { project } from "./project";
import { publication } from "./publication";
import { inspiration } from "./reference";
import { skill } from "./skill";
import { software } from "./software";
import { tag } from "./tag";
import { talk } from "./talk";
import { wishProject } from "./wishProject";

export const schemaTypes: SchemaTypeDefinition[] = [
  tag,
  skill,
  now,
  bio,
  landing,
  inspiration,
  project,
  publication,
  article,
  movie,
  book,
  album,
  mix,
  software,
  talk,
  nonprofit,
  future,
  wishProject,
  photo,
];
