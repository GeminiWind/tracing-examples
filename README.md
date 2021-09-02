# Tracing Examples

This project contains common example of implement tracing in the real world by using OpenTelemetry.

All example has their documentation to setup and run in local, please follow up it

| Project | Description|
|:--:|:--:|
|[basic-example](https://github.com/GeminiWind/tracing-examples/blob/master/basic-example)| Example of basic tracing with default and no customization |



# Telemetry

OpenTelemetry is a set of APIs, SDKs, tooling and integrations that are designed for the creation and management of telemetry data such as traces, `metric`s, and logs. It provides a vendor-agnostic implementation that can be configured to send telemetry data to the backend(s) of your choice. It supports a variety of popular open-source projects including Jaeger and Prometheus.

Below is the OpenTelemetry Architecture

![OpenTelemetry Architecture](./OpenTelemetry-Arch.png)


| Component | Description|
|:--:|:--:|
| [Collector](https://opentelemetry.io/docs/concepts/components/#collector)| The OpenTelemetry Collector offers a vendor-agnostic implementation on how to receive, process, and export telemetry data. It removes the need to run, operate, and maintain multiple agents/collectors in order to support open-source observability data formats (e.g. Jaeger, Prometheus, etc.) sending to one or more open-source or commercial back-ends. The Collector is the default location instrumentation libraries export their telemetry data.n |
| [Data Sources](https://opentelemetry.io/docs/concepts/components/#collector)| OpenTelemetry supports multiple data sources as defined in [here]() |
|[Data Collection](https://opentelemetry.io/docs/concepts/data-collection/)| The OpenTelemetry project facilitates the collection of telemetry data via the OpenTelemetry Collector. The OpenTelemetry Collector offers a vendor-agnostic implementation on how to receive, process, and export telemetry data. It removes the need to run, operate, and maintain multiple agents/collectors in order to support open-source observability data formats (e.g. Jaeger, Prometheus, etc.) sending to one or more open-source or commercial back-ends. In addition, the Collector gives end-users control of their data. The Collector is the default location instrumentation libraries export their telemetry data.|

## Data Source

### Traces
Traces track the progression of a single request, called a `trace`, as it is handled by services that make up an application. The request may be initiated by a user or an application. Distributed tracing is a form of tracing that traverses process, network and security boundaries. **Each unit of work in a ``trace`` is called a *`span`*; a *`trace`* is a tree of **spans****. Spans are objects that represent the work being done by individual services or components involved in a request as it flows through a system. A `span` contains a `span` context, which is a set of globally unique identifiers that represent the unique request that each `span` is a part of. A `span` provides Request, Error and Duration (RED) `metric`s that can be used to debug availability as well as performance issues.

A `trace` contains a single root `span` which encapsulates the end-to-end latency for the entire request. You can think of this as a single logical operation, such as clicking a button in a web application to add a product to a shopping cart. The root `span` would measure the time it took from an end-user clicking that button to the operation being completed or failing (so, the item is added to the cart or some error occurs) and the result being displayed to the user. A `trace` is comprised of the single root `span` and any number of child spans, which represent operations taking place as part of the request. Each `span` contains metadata about the operation, such as its name, start and end timestamps, attributes, events, and status.

To create and manage spans in OpenTelemetry, the OpenTelemetry API provides the tracer interface. This object is responsible for tracking the active `span` in your process, and allows you to access the current `span` in order to perform operations on it such as adding attributes, events, and finishing it when the work it tracks is complete. One or more tracer objects can be created in a process through the tracer provider, a factory interface that allows for multiple tracers to be instantiated in a single process with different options.

Generally, the lifecycle of a `span` resembles the following:

- A request is received by a service. The `span` context is extracted from the request headers, if it exists.
- A new `span` is created as a child of the extracted `span` context; if none exists, a new root `span` is created.
- The service handles the request. Additional attributes and events are added to the `span` that are useful for understanding the context of the request, such as the hostname of the machine handling the request, or customer identifiers.
- New spans may be created to represent work being done by sub-components of the service.
- When the service makes a remote call to another service, the current `span` context is serialized and forwarded to the next service by injecting the `span` context into the headers or message envelope.
- The work being done by the service completes, successfully or not. The `span` status is appropriately set, and the `span` is marked finished.

### Metrics
A `metric` is a measurement about a service, captured at runtime. Logically, the moment of capturing one of these measurements is known as a `metric` event which consists not only of the measurement itself, but the time that it was captured and associated metadata.

Application and request `metric`s are important indicators of availability and performance. Custom metrics can provide insights into how availability indicators impact user experience or the business. Collected data can be used to alert of an outage or trigger scheduling decisions to scale up a deployment automatically upon high demand.

OpenTelemetry defines three `metric` instruments today:

- `counter`: a value that is summed over time – you can think of this like an odometer on a car; it only ever goes up.
- `measure`: a value that is aggregated over time. This is more akin to the trip odometer on a car, it represents a value over some defined range.
- `observer`: captures a current set of values at a particular point in time, like a fuel gauge in a vehicle.

In addition to the three `metric` instruments, the concept of aggregations is an important one to understand. An aggregation is a technique whereby a large number of measurements are combined into either exact or estimated statistics about `metric` events that took place during a time window. The OpenTelemetry API itself does not allow you to specify these aggregations, but provides some default ones. Please see the specification for more details. In general, the OpenTelemetry SDK provides for common aggregations (such as sum, count, last value, and histograms) that are supported by visualizers and telemetry backends.

Unlike request tracing, which is intended to capture request lifecycles and provide context to the individual pieces of a request, metrics are intended to provide statistical information in aggregate. Some examples of use cases for metrics include:

- Reporting the total number of bytes read by a service, per protocol type.
- Reporting the total number of bytes read and the bytes per request.
- Reporting the duration of a system call.
- Reporting request sizes in order to determine a trend.
- Reporting CPU or memory usage of a process.
- Reporting average balance values from an account.
- Reporting current active requests being handled.


## Logs
A `log` is a timestamped text record, either structured (recommended) or unstructured, with metadata. While logs are an independent data source, they may also be attached to spans. In OpenTelemetry, any data that is not part of a distributed `trace` or a `metric` is a log. For example, events are a specific type of log. Logs are often used to determine the root cause of an issue and typically contain information about who changed what as well as the result of the change.

## References
- https://opentelemetry.io/docs
