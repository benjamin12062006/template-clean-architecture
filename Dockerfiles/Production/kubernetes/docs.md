Entiendo tu confusión. Te lo explico paso a paso:

## Flujo de Build y Deploy:

**1. Build Local (lo que hace el Dockerfile):**
```
Tu código local → COPY . . → Imagen Docker 
                              (contiene todo: código + dependencias + build)
```

El Dockerfile **copia TODO tu código** dentro de la imagen con `COPY . .`. La imagen resultante es **standalone**, no necesita conectarse a nada.

**2. Publicar la Imagen:**
```
Imagen Docker → Push → Docker Hub/Registry
                        (guardada en la nube)
```

**3. Kubernetes Descarga y Ejecuta:**
```
Kubernetes → Descarga imagen del Registry
          → Ejecuta contenedor
          → App corriendo (sin necesidad de Git)
```

---

## Diferencia clave:

**❌ NO se conecta a GitHub en runtime** - El código ya está dentro de la imagen.

**✅ Si necesitas actualizar el código en producción:**
1. Cambias código en local
2. Reconstruyes la imagen: `docker build -t mi-app:v2 .`
3. Subes a registry: `docker push mi-app:v2`
4. Kubernetes descarga la nueva versión

---

**Alternativa: GitOps (automático)**
Si usas herramientas como **ArgoCD** o **Flux**, se conectan a GitHub y redeploy automáticamente cuando detectan cambios en el repo.

¿Queda más claro?