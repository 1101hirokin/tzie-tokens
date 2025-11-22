// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "TzieTokens",
    platforms: [
        .iOS(.v14),
        .macOS(.v12)
    ],
    products: [
        .library(
            name: "TzieTokens",
            targets: ["TzieTokens"]
        )
    ],
    targets: [
        .target(
            name: "TzieTokens",
            path: "dist/ios",
            sources: [
                "DesignTokens.swift"
            ]
        )
    ]
)
