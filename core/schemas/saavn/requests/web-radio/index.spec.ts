import { describe, it } from "vitest";
import { expectSchema, getPostmanResponse } from "../../helpers/spec.helper";
import * as schema from "./index.schema";

const GROUP_NAME = "Web Radio";

const testCases = [
  {
    name: "SaavnWebRadioCreateFeaturedStationSchema",
    request: "Create Featured Station",
    schema: schema.SaavnWebRadioCreateFeaturedStationSchema,
  },
  {
    name: "SaavnWebRadioCreateEntityStationSchema",
    request: "Create Entity Station",
    schema: schema.SaavnWebRadioCreateEntityStationSchema,
  },
  {
    name: "SaavnWebRadioGetStationSongsSchema",
    request: "Get Station Songs",
    schema: schema.SaavnWebRadioGetStationSongsSchema,
  },
];

testCases.forEach(({ name, request, schema }) => {
  describe(name, () => {
    it(GROUP_NAME, () => {
      expectSchema(schema, getPostmanResponse(GROUP_NAME, request), request);
    });
  });
});
