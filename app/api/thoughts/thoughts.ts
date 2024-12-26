'use client';

export async function submitThought(content: string) {
  // Validate input content
  if (!content || typeof content !== 'string' || content.trim() === '') {
    throw new Error('Invalid thought content. Please provide a non-empty string.');
  }

  try {
    // Send POST request to the API
    const response = await fetch('/api/thoughts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    // Check if response is OK
    if (!response.ok) {
      // Log error details for debugging
      const errorDetails = await response.text();
      console.error('Error submitting thought:', {
        status: response.status,
        statusText: response.statusText,
        details: errorDetails,
      });

      // Throw a more descriptive error
      throw new Error(
        `Failed to submit thought. Status: ${response.status} - ${response.statusText}`
      );
    }

    // Return parsed JSON response
    return response.json();
  } catch (error) {
    // Catch network errors or unexpected issues
    console.error('Unexpected error during thought submission:', error);
    throw new Error(
      'An unexpected error occurred while submitting the thought. Please try again.'
    );
  }
}
