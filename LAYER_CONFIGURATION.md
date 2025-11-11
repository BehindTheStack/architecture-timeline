# Layer Configuration Guide

## Overview

The application uses a centralized layer configuration system to ensure consistency between the ML classification pipeline and the frontend display. All layer definitions, colors, and metadata are managed in a single source of truth: `frontend/app/lib/layers.ts`.

## Architecture Layers

The system currently recognizes **9 ML-classified architecture layers** from the Netflix Tech Blog content:

| Layer ID | Display Name | Description | Color | Hex |
|----------|--------------|-------------|-------|-----|
| `backend-apis` | Backend APIs | Reactive programming, API design, microservices | Orange | #f97316 |
| `video-streaming` | Video Streaming | Encoding, quality, playback optimization | Pink | #ec4899 |
| `platform-tooling` | Platform Tooling | Open source tools, infrastructure utilities | Yellow | #eab308 |
| `data-infrastructure` | Data Infrastructure | Data systems, pipelines, storage | Blue | #3b82f6 |
| `observability` | Observability | Monitoring, metrics, alerting, auto-scaling | Indigo | #6366f1 |
| `engineering-culture` | Engineering Culture | Practices, processes, team culture | Purple | #a855f7 |
| `performance` | Performance | Optimization, caching, speed improvements | Red | #ef4444 |
| `distributed-systems` | Distributed Systems | Cassandra, databases, microservices architecture | Green | #10b981 |
| `cloud-infrastructure` | Cloud Infrastructure | AWS, cloud migration, scaling | Cyan | #06b6d4 |

## File Structure

```
webapp/frontend/app/
├── lib/
│   └── layers.ts           # ⭐ SINGLE SOURCE OF TRUTH
└── components/
    ├── LayerFilter.tsx     # Uses: getLayerGradient, getLayerName
    ├── TimelineCards.tsx   # Uses: getLayerConfig, getLayerName
    ├── TimelineMagazine.tsx # Uses: getLayerConfig, getLayerName
    ├── TimelineGrid.tsx    # Uses: getLayerConfig, getLayerName
    ├── PostDetail.tsx      # Uses: getLayerConfig, getLayerName
    └── TimelineVisualization.tsx # Uses: getLayerConfig, getLayerName
```

## Synchronization with ML Pipeline

### ML Pipeline Source
The layer names and classifications come from:
```
/scripts/relabel_discovered_topics.py
```

This script contains the `MANUAL_TOPIC_LABELS` mapping that defines the semantic layer names used by the ML classifier.

### Example Mapping
```python
MANUAL_TOPIC_LABELS = {
    "Api/Rx": "backend-apis",
    "Data/Cloud": "data-infrastructure",
    "Encoding/Video": "video-streaming",
    # ... etc
}
```

### Update Process
When the ML pipeline is retrained or relabeled:

1. **Check for new layer names** in `scripts/relabel_discovered_topics.py`
2. **Update `webapp/frontend/app/lib/layers.ts`** with new layers:
   ```typescript
   export const LAYERS: Record<string, LayerConfig> = {
     'new-layer-id': {
       id: 'new-layer-id',
       name: 'New Layer Name',
       description: 'Layer description',
       gradient: 'from-color-500 to-color-700',
       color: 'color',
       hexColor: '#hex',
       bgClass: 'bg-color-500/10',
       textClass: 'text-color-400',
       borderClass: 'border-color-500/30',
       icon: React.createElement(Icon, { className: "w-4 h-4" }),
     },
     // ... existing layers
   }
   ```
3. **No changes needed in components** - they automatically use the updated configuration

## API Reference

### LayerConfig Interface

```typescript
export interface LayerConfig {
  id: string              // Machine-readable identifier (from ML pipeline)
  name: string            // Human-readable display name
  description: string     // Layer description for tooltips/docs
  gradient: string        // Tailwind gradient classes (from-X to-Y)
  color: string           // Base color name (orange, blue, etc.)
  hexColor: string        // Hex color for external libraries (vis-timeline)
  bgClass: string         // Tailwind background class
  textClass: string       // Tailwind text color class
  borderClass: string     // Tailwind border color class
  icon?: React.ReactNode  // Lucide icon component
}
```

### Helper Functions

#### `getLayerConfig(layerId: string): LayerConfig`
Returns complete configuration for a layer. Falls back to `DEFAULT_LAYER` if not found.

**Usage:**
```typescript
const config = getLayerConfig('backend-apis')
// Returns: { id: 'backend-apis', name: 'Backend APIs', ... }
```

#### `getLayerGradient(layerId: string): string`
Returns Tailwind gradient classes for a layer.

**Usage:**
```typescript
const gradient = getLayerGradient('video-streaming')
// Returns: "from-pink-500 to-pink-700"
```

#### `getLayerName(layerId: string): string`
Returns human-readable display name for a layer.

**Usage:**
```typescript
const name = getLayerName('cloud-infrastructure')
// Returns: "Cloud Infrastructure"
```

#### `getLayerIcon(layerId: string): React.ReactNode`
Returns Lucide icon for a layer.

**Usage:**
```typescript
const icon = getLayerIcon('data-infrastructure')
// Returns: <Database className="w-4 h-4" />
```

## Legacy Layer Support

The system includes backward compatibility for old layer names:

```typescript
export const LEGACY_LAYER_MAP: Record<string, string> = {
  'data': 'data-infrastructure',
  'streaming': 'video-streaming',
  'infrastructure': 'cloud-infrastructure',
  'platform': 'platform-tooling',
  'frontend/ui': 'platform-tooling',
  'api/backend': 'backend-apis',
  'ml/data-science': 'data-infrastructure',
  'security': 'platform-tooling',
}
```

### `normalizeLayerName(layerName: string): string`
Converts legacy layer names to canonical names.

**Usage:**
```typescript
const canonical = normalizeLayerName('api/backend')
// Returns: "backend-apis"
```

## Color Design Philosophy

Colors are semantically matched to layer purposes:

- **Orange** (Backend APIs): Energetic, API-focused
- **Pink** (Video Streaming): Media/entertainment
- **Yellow** (Platform Tooling): Utility/support
- **Blue** (Data Infrastructure): Data/information
- **Indigo** (Observability): Monitoring/insights
- **Purple** (Engineering Culture): People/process
- **Red** (Performance): Speed/optimization
- **Green** (Distributed Systems): Growth/scalability
- **Cyan** (Cloud Infrastructure): Cloud/sky association

## Component Integration Examples

### TimelineCards.tsx
```typescript
import { getLayerConfig, getLayerName } from '../lib/layers'

const config = getLayerConfig(primaryLayer)
<div className={`bg-gradient-to-br ${config.gradient}`}>
  <span>{getLayerName(primaryLayer)}</span>
</div>
```

### TimelineVisualization.tsx
```typescript
import { getLayerConfig, getLayerName } from '../lib/layers'

const layerConfig = getLayerConfig(layer)
const layerColor = layerConfig.hexColor  // For vis-timeline library
```

### LayerFilter.tsx
```typescript
import { getLayerGradient, getLayerName } from '../lib/layers'

const colorClass = getLayerGradient(layer.name)
const displayName = getLayerName(layer.name)
```

## Testing Layer Changes

After updating layer configuration:

1. **Check all views**: Cards, Magazine, Grid, Timeline
2. **Verify filters**: Ensure LayerFilter shows updated layers
3. **Test color consistency**: Check gradients render correctly
4. **Validate data**: Ensure backend data matches layer IDs

## Maintenance Checklist

When ML pipeline changes:

- [ ] Review `scripts/relabel_discovered_topics.py` for new layer names
- [ ] Update `LAYERS` object in `webapp/frontend/app/lib/layers.ts`
- [ ] Assign semantic colors and icons to new layers
- [ ] Update `LEGACY_LAYER_MAP` if old names are deprecated
- [ ] Test all visualization modes
- [ ] Update this documentation

## Benefits of Centralization

✅ **Single Source of Truth**: All layer config in one file  
✅ **Type Safety**: TypeScript interface ensures consistency  
✅ **Easy Updates**: Change once, apply everywhere  
✅ **ML Pipeline Sync**: Direct mapping from classification output  
✅ **Maintainable**: Clear documentation and helper functions  
✅ **Backward Compatible**: Legacy name mapping included  

## Related Documentation

- **ML Pipeline**: See `/scripts/relabel_discovered_topics.py`
- **API Endpoints**: See `/webapp/README.md`
- **Component Architecture**: See `/webapp/frontend/app/components/`
- **Performance**: See `/webapp/PERFORMANCE.md`

---

**Last Updated**: January 2025  
**Maintained By**: BehindTheStack Team
