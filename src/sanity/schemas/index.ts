import type { SchemaTypeDefinition } from "sanity";

import { album } from "./album";
import { art } from "./art";
import { article } from "./article";
import { bio } from "./bio";
import { book } from "./book";
import { education } from "./education";
import { future } from "./future";
import { inspiration } from "./reference";
import { landing } from "./landing";
import { mix } from "./mix";
import { movie } from "./movie";
import { nonprofit } from "./nonprofit";
import { now } from "./now";
import { photo } from "./photo";
import { photography } from "./photography";
import { project } from "./project";
import { publication } from "./publication";
import { role } from "./role";
import { skill } from "./skill";
import { software } from "./software";
import { tag } from "./tag";
import { talk } from "./talk";
import { volunteer } from "./volunteer";
import { radioEpisode } from "./radio-episode";
import { wallpapers } from "./wallpaper";
import { welcome } from "./welcome";
import { wish } from "./wish";
import { wishProject } from "./wishProject";
import { writing } from "./writing";

export const schemaTypes: SchemaTypeDefinition[] = [
  tag,
  skill,
  now,
  bio,
  landing,
  inspiration,
  role,
  education,
  volunteer,
  project,
  publication,
  article,
  movie,
  book,
  album,
  art,
  mix,
  software,
  talk,
  nonprofit,
  future,
  writing,
  wish,
  wishProject,
  welcome,
  wallpapers,
  photo,
  photography,
  radioEpisode,
];
