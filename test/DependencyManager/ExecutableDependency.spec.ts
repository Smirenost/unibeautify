import {
  ExecutableDependency,
  DependencyType,
  DependencyOptions,
} from "../../src/DependencyManager";

test("should fail to load Executable dependency", async () => {
  expect.assertions(3);
  const options: DependencyOptions = {
    name: "NotFound",
    program: "NotFound",
    type: DependencyType.Executable,
  };
  const dependency = new ExecutableDependency(options);

  return await dependency.load().catch(error => {
    expect(error.message).toMatch(
      'Dependency "NotFound" is required and not installed.',
    );
    expect(dependency.isInstalled).toBe(false);
    expect(dependency.errors).toHaveLength(1);
  });
});

describe("successfully loaded Executable dependency", () => {
  test("should successfully load Executable dependency", async () => {
    expect.assertions(3);
    const options: DependencyOptions = {
      name: "Node",
      program: "node",
      type: DependencyType.Executable,
    };
    const dependency = new ExecutableDependency(options);

    return await dependency.load().then(isInstalled => {
      expect(isInstalled).toBe(true);
      expect(dependency.isInstalled).toBe(true);
      expect(dependency.errors).toHaveLength(0);
    });
  });

  test("should successfully run command for Executable dependency", async () => {
    expect.assertions(2);
    const options: DependencyOptions = {
      name: "Node",
      program: "node",
      type: DependencyType.Executable,
    };
    const dependency = new ExecutableDependency(options);

    return await dependency.load().then(() => {
      expect(dependency.isInstalled).toBe(true);
      return dependency.run(["--help"]).then(({ stdout }) => {
        expect(stdout).toContain("node");
      });
    });
  });
});
