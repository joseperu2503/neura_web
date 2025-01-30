import { environment } from '../../../../environments/environment';

export async function* completionStreamUseCase(
  prompt: string,
  chaId: string,
  abortSignal: AbortSignal
) {
  try {
    const resp = await fetch(`${environment.baseUrl}/chats/completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: prompt, chatId: chaId }),
      signal: abortSignal,
    });

    if (!resp.ok) throw new Error('No se pudo realizar la comparacion');

    const reader = resp.body?.getReader();

    if (!reader) {
      console.log('No se pudo generar el reader');
      throw new Error('No se pudo generar el reader');
    }

    const decoder = new TextDecoder();
    let text = '';

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      const decodedChunk = decoder.decode(value, { stream: true });

      text += decodedChunk;
      yield text;
    }

    return text;
  } catch (error) {
    console.log(error);
    return null;
  }
}
