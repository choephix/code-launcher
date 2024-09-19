export async function helloWorld(testString?: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Hello, world!');
  if (testString) {
    console.log(testString);
  }
}
