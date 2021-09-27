export function formatLogMessage(
  error: Error,
  type: string,
  userEmail: string
) {
  const currentDate = new Date().toLocaleString();
  const message = `Type: "${type}" 
        Time: ${currentDate}\n
        -----------------------------\n
        User: ${userEmail}\n
        Type: ${error.name}\n
        Message: ${error.message}\n
        Stack Trace: ${error.stack}\n`;

  return message;
}
