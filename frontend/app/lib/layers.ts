/**
 * Centralized Layer Configuration
 * 
 * This file defines the canonical layer names and their visual styling.
 * Layers are based on ML classification from scripts/relabel_discovered_topics.py
 * 
 * Update this file if layer names change after ML pipeline retraining.
 */

import React from 'react'
import { Database, Zap, Globe, TrendingUp, Wrench, Users, Gauge, Network, Cloud, Tag } from 'lucide-react'

export interface LayerConfig {
  id: string
  name: string
  description: string
  gradient: string
  color: string
  hexColor: string  // for external libraries (vis-timeline, etc.)
  bgClass: string
  textClass: string
  borderClass: string
  icon?: React.ReactNode
}

/**
 * Official layer definitions from ML pipeline
 * Source: scripts/relabel_discovered_topics.py
 */
export const LAYERS: Record<string, LayerConfig> = {
  'backend-apis': {
    id: 'backend-apis',
    name: 'Backend APIs',
    description: 'Reactive programming, API design, microservices',
    gradient: 'from-orange-500 to-orange-700',
    color: 'orange',
    hexColor: '#f97316',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-400',
    borderClass: 'border-orange-500/30',
    icon: React.createElement(Globe, { className: "w-4 h-4" }),
  },
  'video-streaming': {
    id: 'video-streaming',
    name: 'Video Streaming',
    description: 'Encoding, quality, playback optimization',
    gradient: 'from-pink-500 to-pink-700',
    color: 'pink',
    hexColor: '#ec4899',
    bgClass: 'bg-pink-500/10',
    textClass: 'text-pink-400',
    borderClass: 'border-pink-500/30',
    icon: React.createElement(Zap, { className: "w-4 h-4" }),
  },
  'platform-tooling': {
    id: 'platform-tooling',
    name: 'Platform Tooling',
    description: 'Open source tools, infrastructure utilities',
    gradient: 'from-yellow-500 to-yellow-700',
    color: 'yellow',
    hexColor: '#eab308',
    bgClass: 'bg-yellow-500/10',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-500/30',
    icon: React.createElement(Wrench, { className: "w-4 h-4" }),
  },
  'data-infrastructure': {
    id: 'data-infrastructure',
    name: 'Data Infrastructure',
    description: 'Data systems, pipelines, storage',
    gradient: 'from-blue-500 to-blue-700',
    color: 'blue',
    hexColor: '#3b82f6',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    icon: React.createElement(Database, { className: "w-4 h-4" }),
  },
  'observability': {
    id: 'observability',
    name: 'Observability',
    description: 'Monitoring, metrics, alerting, auto-scaling',
    gradient: 'from-indigo-500 to-indigo-700',
    color: 'indigo',
    hexColor: '#6366f1',
    bgClass: 'bg-indigo-500/10',
    textClass: 'text-indigo-400',
    borderClass: 'border-indigo-500/30',
    icon: React.createElement(TrendingUp, { className: "w-4 h-4" }),
  },
  'engineering-culture': {
    id: 'engineering-culture',
    name: 'Engineering Culture',
    description: 'Practices, processes, team culture',
    gradient: 'from-purple-500 to-purple-700',
    color: 'purple',
    hexColor: '#a855f7',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/30',
    icon: React.createElement(Users, { className: "w-4 h-4" }),
  },
  'performance': {
    id: 'performance',
    name: 'Performance',
    description: 'Optimization, caching, speed improvements',
    gradient: 'from-red-500 to-red-700',
    color: 'red',
    hexColor: '#ef4444',
    bgClass: 'bg-red-500/10',
    textClass: 'text-red-400',
    borderClass: 'border-red-500/30',
    icon: React.createElement(Gauge, { className: "w-4 h-4" }),
  },
  'distributed-systems': {
    id: 'distributed-systems',
    name: 'Distributed Systems',
    description: 'Cassandra, databases, microservices architecture',
    gradient: 'from-green-500 to-green-700',
    color: 'green',
    hexColor: '#10b981',
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-400',
    borderClass: 'border-green-500/30',
    icon: React.createElement(Network, { className: "w-4 h-4" }),
  },
  'cloud-infrastructure': {
    id: 'cloud-infrastructure',
    name: 'Cloud Infrastructure',
    description: 'AWS, cloud migration, scaling',
    gradient: 'from-cyan-500 to-cyan-700',
    color: 'cyan',
    hexColor: '#06b6d4',
    bgClass: 'bg-cyan-500/10',
    textClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/30',
    icon: React.createElement(Cloud, { className: "w-4 h-4" }),
  },
}

/**
 * Default layer configuration for uncategorized content
 */
export const DEFAULT_LAYER: LayerConfig = {
  id: 'uncategorized',
  name: 'Uncategorized',
  description: 'Content not yet classified',
  gradient: 'from-gray-500 to-gray-700',
  color: 'gray',
  hexColor: '#6b7280',
  bgClass: 'bg-gray-500/10',
  textClass: 'text-gray-400',
  borderClass: 'border-gray-500/30',
  icon: React.createElement(Tag, { className: "w-4 h-4" }),
}

/**
 * Get layer configuration (with fallback to default)
 */
export function getLayerConfig(layerId: string): LayerConfig {
  return LAYERS[layerId] || DEFAULT_LAYER
}

/**
 * Get gradient class for a layer
 * Falls back to gray if layer not found
 */
export function getLayerGradient(layerId: string): string {
  return LAYERS[layerId]?.gradient || DEFAULT_LAYER.gradient
}

/**
 * Get display name for a layer
 */
export function getLayerName(layerId: string): string {
  return LAYERS[layerId]?.name || layerId
}

/**
 * Get icon for a layer
 */
export function getLayerIcon(layerId: string): React.ReactNode {
  return LAYERS[layerId]?.icon || DEFAULT_LAYER.icon
}

/**
 * Get all layer IDs in canonical order
 */
export function getLayerIds(): string[] {
  return Object.keys(LAYERS)
}

/**
 * Legacy layer mapping for backward compatibility
 * Maps old layer names to new ML-based names
 */
export const LEGACY_LAYER_MAP: Record<string, string> = {
  'data': 'data-infrastructure',
  'streaming': 'video-streaming',
  'video/encoding': 'video-streaming',
  'infrastructure': 'cloud-infrastructure',
  'platform': 'platform-tooling',
  'frontend/ui': 'platform-tooling',
  'api/backend': 'backend-apis',
  'ml/data-science': 'data-infrastructure',
  'security': 'platform-tooling',
}

/**
 * Normalize layer name (handles legacy names)
 */
export function normalizeLayerName(layerName: string): string {
  return LEGACY_LAYER_MAP[layerName] || layerName
}
