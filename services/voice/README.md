# Voice Service

This service handles voice-agent interactions for Allowance Buddy using ElevenLabs.

## Responsibilities
- Generate child-friendly spoken guidance (saving, investing, spending feedback).
- Support parent-safe moderation and response controls.
- Map app/hardware events to voice interactions.
- Keep configuration for ElevenLabs in one place.

## Planned Interface
- Input: event payloads from backend/vision services.
- Output: speech audio metadata, transcript text, and event logs.

## Environment Variables
Define these in the root `.env` file:
- `VOICE_PORT`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_AGENT_ID`
- `ELEVENLABS_VOICE_ID`
- `ELEVENLABS_MODEL_ID`
- `ELEVENLABS_WEBHOOK_SECRET`
- `VOICE_DEFAULT_LANGUAGE`
- `VOICE_MAX_RESPONSE_SECONDS`

## Next Build Steps
1. Implement ElevenLabs API client in `src/`.
2. Add webhook verification and request signing checks.
3. Add prompt templates in `prompts/` for kid and parent modes.
4. Add integration tests in `tests/` using mocked ElevenLabs responses.
