# Tracing Examples

This project contains common example of implement tracing in the real world. All example has their documentation to setup and run in local, please follow up it

| Project | Description|
|:--:|:--:|
|[basic-example](https://github.com/GeminiWind/tracing-examples/blob/master/basic-example)| Example of basic tracing with default and no customization |

## Terminology

### Distributed Tracing

Distributed Tracing is example repository how to implement distributed tracing in the micro-service system by using [OpenTelemetry](https://github.com/open-telemetry). Tracing reports the execution for each unit of work in your request as well as visualize the entire journey of request through services in micro-service system

### Trace

Traces track the progression of a single request, called a trace, as it is handled by services that make up an application. The request may be initiated by a user or an application. Distributed tracing is a form of tracing that traverses process, network and security boundaries. Each unit of work in a trace is called a span; a trace is a tree of spans. Spans are objects that represent the work being done by individual services or components involved in a request as it flows through a system (from https://opentelemetry.io/docs/concepts/data-sources/)
