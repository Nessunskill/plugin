import { Core } from "@brizy/core";
import { AbstractPlugin } from "@brizy/core";

class Contentful extends AbstractPlugin {
  constructor(core: Core) {
    super("Contentful", core);
    this.addFilter("GET_API_CLIENT", this.getClient);
    this.addFilter("GET_COLLECTION_TYPES", this.getCollectionTypes);
  }

  getClient = (client: unknown) => {
    if (typeof client === "object") {
      console.log("client", client);
      return { ...client, getPage: this.getPage };
    } else {
      throw new Error("Wrong API client");
    }
  };

  getPage() {
    return {
      name: "FROM Contentful",
    };
  }

  getCollectionTypes(payload: unknown) {
    if (typeof payload === "number") {
      return payload + 1;
    } else {
      return null;
    }
  }
}

export { Contentful };
