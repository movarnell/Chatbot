const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function sendMessage(messages: { role: string; content: string }[]) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    return reader;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}