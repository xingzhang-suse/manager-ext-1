import { Object3D } from "three";

import { DestroyableObject3D, removeChildren } from "../DestroyableObject3D";

describe("DestroyableObject3D", () => {
  it("should call destroy when removed from another Object3D and remove all children from it", () => {
    const parent = new Object3D();

    const subject = new DestroyableObject3D();
    subject.add(new Object3D(), new Object3D(), new Object3D());
    parent.add(subject);

    expect(subject.children).toHaveLength(3);

    parent.remove(subject);
    expect(subject.children).toHaveLength(0);

    // on the second time shouldn't do anything because subject unsubscribed from remove event
    parent.add(subject);
    subject.add(new Object3D(), new Object3D(), new Object3D());
    parent.remove(subject);
    expect(subject.children).toHaveLength(3);
  });

  it("should remove all children from Object3D by using the remove function", () => {
    const subject = new Object3D();
    const spy = vi.spyOn(subject, "remove");
    const children: Array<Object3D> = [new Object3D(), new Object3D()];

    subject.add(...children);
    expect(subject.children).toHaveLength(2);
    removeChildren(subject);
    expect(subject.children).toHaveLength(0);
    expect(spy).toHaveBeenCalled();
  });
});
