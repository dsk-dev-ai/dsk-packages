---
"@darshankachare/logger": minor
---

Improve logger architecture, formatting, and developer experience

- Add pluggable formatter system with LogFormatter interface, TextFormatter, and JsonFormatter
- Improve ConsoleTransport with backward-compatible options object constructor
- Add child logger support with merged prefix and inherited metadata
- Improve error serialization with cause chains and error codes
- Add safe metadata serialization with circular reference and BigInt support
- Export LEVELS constant and getLevelPriority for extensible level system
- Comprehensive test suite with 81 tests
