import Component from "@ember/component";
import { assign } from "@ember/polyfills";
// @ts-ignore
import layout from "@zestia/ember-dragula/templates/components/ember-dragula";
import EmberDragulaContainer from "./ember-dragula-container";

export default class EmberDragula extends Component.extend( {
  classNames: ["ember-dragula"],
  layout,
}) {

  public drake: any;
  public options: any;
  public events: string[];
  public onInit?: (drake: any) => void;

  public actions = {
    addContainer(this: EmberDragula, containerComponent: EmberDragulaContainer) {
      const element = containerComponent.get("element");
      const containers = this.drake.containers;
      containers.push(element);
    },

    removeContainer(this: EmberDragula, containerComponent: EmberDragulaContainer) {
      const element = containerComponent.get("element");
      const containers = this.drake.containers;
      const index = containers.indexOf(element);
      containers.splice(index, 1);
    },
  };

  constructor() {
    super(...arguments);
    this.drake = (window as any).dragula(assign({}, this.options));
    this.events = [
      "drag",
      "dragend",
      "drop",
      "cancel",
      "remove",
      "shadow",
      "over",
      "out",
      "cloned",
    ];
    this.setupHandlers();
    if (this.onInit) {
      this.onInit(this.drake);
    }
  }

  public willDestroyElement(this: EmberDragula) {
    this._super(...arguments);
    this.drake.destroy();
  }

  private setupHandlers(this: EmberDragula) {
      this.events.forEach((event) => {
        this.drake.on(event, (...args: any[]) => {
          // @ts-ignore
          // tslint:disable
          this.getWithDefault(`on-${event}`, () => {})(...args);
        });
      });
    }
}