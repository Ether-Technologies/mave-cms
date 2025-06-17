export const features = [
    {
        icon: "/icons/mave/component.svg",
        title: "Advanced Page Builder",
        description: "16+ pre-built components with drag-and-drop interface and real-time preview capabilities.",
        details: {
            overview: "A powerful component-based architecture that enables developers and content creators to build complex layouts with ease.",
            capabilities: [
                "Component-Based Architecture",
                "16+ pre-built components",
                "Drag-and-drop interface",
                "Real-time preview",
                "Component duplication",
                "Component customization"
            ],
            technical: {
                components: {
                    basic: [
                        {
                            name: "Title",
                            features: ["Multiple heading styles", "Custom typography", "Color options", "Responsive sizing"]
                        },
                        {
                            name: "Paragraph",
                            features: ["Rich text editing", "Text alignment", "Line height control", "Custom fonts"]
                        },
                        {
                            name: "Media",
                            features: ["Image optimization", "Video embedding", "Gallery support", "Lazy loading"]
                        },
                        {
                            name: "Menu",
                            features: ["Multi-level navigation", "Mobile responsive", "Custom styling", "Mega menu support"]
                        },
                        {
                            name: "Navbar",
                            features: ["Sticky positioning", "Transparent mode", "Search integration", "User menu"]
                        },
                        {
                            name: "Slider",
                            features: ["Auto-play", "Touch support", "Custom transitions", "Responsive design"]
                        },
                        {
                            name: "Card",
                            features: ["Multiple layouts", "Hover effects", "Custom borders", "Shadow options"]
                        },
                        {
                            name: "Footer",
                            features: ["Widget areas", "Social links", "Newsletter form", "Copyright section"]
                        }
                    ],
                    pro: [
                        {
                            name: "Video",
                            features: ["Multiple sources", "Autoplay control", "Custom player", "Playlist support"]
                        },
                        {
                            name: "Table",
                            features: ["Sorting", "Filtering", "Pagination", "Responsive design"]
                        },
                        {
                            name: "Accordion",
                            features: ["Nested items", "Custom icons", "Animation", "Multiple styles"]
                        },
                        {
                            name: "Button",
                            features: ["Multiple styles", "Icon support", "Hover effects", "Loading states"]
                        },
                        {
                            name: "Gallery",
                            features: ["Grid layout", "Masonry view", "Lightbox", "Filter categories"]
                        },
                        {
                            name: "Google Map",
                            features: ["Custom markers", "Directions", "Street view", "Custom styling"]
                        },
                        {
                            name: "Icon List",
                            features: ["Icon library", "Custom icons", "Animation", "Multiple layouts"]
                        },
                        {
                            name: "Testimonial",
                            features: ["Carousel view", "Rating system", "Author info", "Custom styling"]
                        }
                    ]
                },
                features: {
                    dragAndDrop: {
                        title: "Drag and Drop Interface",
                        capabilities: [
                            "Intuitive drag handles",
                            "Snap to grid",
                            "Nested components",
                            "Copy/paste support"
                        ]
                    },
                    preview: {
                        title: "Real-time Preview",
                        capabilities: [
                            "Live updates",
                            "Device preview",
                            "Theme switching",
                            "Responsive testing"
                        ]
                    }
                }
            }
        }
    },
    {
        icon: "/icons/mave/media.svg",
        title: "Media Management System",
        description: "Advanced media library with cloud storage integration and image optimization.",
        details: {
            overview: "A comprehensive media management system that handles all your digital assets with advanced features and optimizations.",
            capabilities: [
                "Single and multiple selection modes",
                "Drag-and-drop upload",
                "Image optimization",
                "Cloud storage integration",
                "Media categorization",
                "Tagging system"
            ],
            technical: {
                supportedFormats: {
                    images: ["JPG", "PNG", "GIF", "SVG", "WebP", "AVIF"],
                    videos: ["MP4", "WebM", "MOV", "AVI"],
                    documents: ["PDF", "DOC", "DOCX", "XLS", "XLSX"],
                    audio: ["MP3", "WAV", "OGG"]
                },
                storage: {
                    type: "Cloud-native with CDN support",
                    features: [
                        "Automatic backup",
                        "Version control",
                        "Geographic distribution",
                        "Cache management"
                    ]
                },
                optimization: {
                    image: [
                        "Automatic compression",
                        "Responsive sizing",
                        "WebP conversion",
                        "Lazy loading"
                    ],
                    video: [
                        "Automatic transcoding",
                        "Thumbnail generation",
                        "Streaming optimization",
                        "Quality adaptation"
                    ]
                }
            }
        }
    },
    {
        icon: "/icons/mave/tools.svg",
        title: "AI-Powered Features",
        description: "Smart content generation and optimization with AI-powered assistance.",
        details: {
            overview: "Leverage the power of artificial intelligence to enhance your content creation and management workflow.",
            capabilities: [
                "AI Chat Integration",
                "Interactive assistance",
                "Content suggestions",
                "Automated content generation",
                "Smart content optimization"
            ],
            technical: {
                aiModels: {
                    language: ["GPT-4", "Claude", "Custom models"],
                    image: ["DALL-E", "Stable Diffusion", "Midjourney"],
                    audio: ["Whisper", "Custom voice models"]
                },
                features: {
                    content: [
                        "Natural language processing",
                        "Content analysis",
                        "SEO optimization",
                        "Tone adjustment"
                    ],
                    automation: [
                        "Smart tagging",
                        "Content categorization",
                        "Related content suggestions",
                        "Trend analysis"
                    ],
                    assistance: [
                        "Context-aware suggestions",
                        "Grammar checking",
                        "Style recommendations",
                        "Content enhancement"
                    ]
                }
            }
        }
    },
    {
        icon: "/icons/mave/creatorstudio.svg",
        title: "Custom Model Generator",
        description: "Create custom models for e-commerce, blogs, or news portals with flexible field types.",
        details: {
            overview: "Build your own content models with a flexible and powerful model generator that adapts to your needs.",
            capabilities: [
                "Custom model creation",
                "E-commerce integration",
                "Blog management",
                "News portal setup",
                "Custom field types",
                "Dynamic form generation"
            ],
            technical: {
                fieldTypes: {
                    basic: [
                        "Text",
                        "Rich Text",
                        "Number",
                        "Date",
                        "Boolean"
                    ],
                    advanced: [
                        "Media",
                        "Relation",
                        "JSON",
                        "Array",
                        "Object"
                    ],
                    special: [
                        "Location",
                        "Color",
                        "Rating",
                        "Price",
                        "Currency"
                    ]
                },
                integrations: {
                    ecommerce: [
                        "Product management",
                        "Inventory tracking",
                        "Order processing",
                        "Payment integration"
                    ],
                    blog: [
                        "Post management",
                        "Category system",
                        "Tag management",
                        "Comment system"
                    ],
                    news: [
                        "Article management",
                        "Section organization",
                        "Author profiles",
                        "Publishing workflow"
                    ]
                }
            }
        }
    },
    {
        icon: "/icons/mave/documentation.svg",
        title: "Form Builder",
        description: "Create and manage custom forms with advanced validation and data collection.",
        details: {
            overview: "A powerful form builder that enables you to create, manage, and process forms with advanced features.",
            capabilities: [
                "Custom form creation",
                "Form validation",
                "Data collection",
                "Form submission handling",
                "Integration with external services"
            ],
            technical: {
                validation: {
                    types: [
                        "Required fields",
                        "Pattern matching",
                        "Custom validation",
                        "Cross-field validation"
                    ],
                    features: [
                        "Real-time validation",
                        "Custom error messages",
                        "Validation rules",
                        "Conditional validation"
                    ]
                },
                integrations: {
                    email: [
                        "SMTP configuration",
                        "Template system",
                        "Auto-responders",
                        "Email tracking"
                    ],
                    crm: [
                        "Lead capture",
                        "Contact management",
                        "Deal tracking",
                        "Pipeline integration"
                    ],
                    database: [
                        "Data storage",
                        "Query builder",
                        "Data export",
                        "Backup system"
                    ],
                    api: [
                        "Webhook support",
                        "REST API",
                        "GraphQL",
                        "Authentication"
                    ]
                }
            }
        }
    },
    {
        icon: "/icons/mave/settings.svg",
        title: "Documentation to API",
        description: "Automatic API generation from documentation with YAML integration.",
        details: {
            overview: "Transform your documentation into fully functional APIs with automatic generation and validation.",
            capabilities: [
                "YAML Integration",
                "Automatic API generation",
                "Documentation parsing",
                "API endpoint creation",
                "Schema validation"
            ],
            technical: {
                formats: {
                    supported: [
                        "OpenAPI",
                        "Swagger",
                        "Custom YAML",
                        "JSON Schema"
                    ],
                    features: [
                        "Format conversion",
                        "Schema validation",
                        "Version control",
                        "Documentation sync"
                    ]
                },
                features: {
                    generation: [
                        "Auto-documentation",
                        "Schema validation",
                        "API testing",
                        "Code generation"
                    ],
                    integration: [
                        "Authentication",
                        "Rate limiting",
                        "Caching",
                        "Monitoring"
                    ],
                    security: [
                        "OAuth2 support",
                        "API keys",
                        "JWT tokens",
                        "Role-based access"
                    ]
                }
            }
        }
    }
]; 