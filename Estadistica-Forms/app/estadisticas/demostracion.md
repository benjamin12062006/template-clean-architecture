El Flujo de Ejecución en Tiempo de Ejecución (Runtime)

Cuando un usuario entra a la pantalla `/estadisticas`, el viaje que hace el dato es justo el inverso (desde la interfaz hacia la infraestructura y la red):

```mermaid
sequenceDiagram
    autonumber
    participant V as Vista (UI)
    participant C as Controlador (Presentation)
    participant UC as Caso de Uso (Application)
    participant GW as Gateway Adapter (Infrastructure)
    participant HTTP as HttpClient (Bootstrap)
    participant API as /api/estadisticas (Next.js route)

    V->>C: Carga la pantalla (onRefresh/init)
    C->>UC: loadEstadisticas()
    UC->>GW: findAll()
    GW->>HTTP: get('/api/estadisticas')
    HTTP->>API: Fetch real a la red
    API-->>GW: Retorna Datos Demo JSON
    GW-->>UC: Traduce JSON a Entidades de Dominio
    UC-->>C: Devuelve Resultado Exitoso
    C-->>V: Actualiza el ViewModel y renderiza la UI
```

### En resumen, tu conclusión es brillante: