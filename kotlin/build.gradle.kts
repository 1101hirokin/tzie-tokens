plugins {
    kotlin("jvm") version "2.0.21"
    `maven-publish`
}

group = "com.tzie"
version = "0.0.0-alpha.0"

java {
    withSourcesJar()
}

repositories {
    mavenCentral()
}

// Style Dictionary が吐いた Kotlin ファイルをソースに含める
sourceSets {
    named("main") {
        // tokens リポのルートから見た相対パスを調整する
        kotlin.srcDir("../dist/compose")
    }
    named("test") {
        // テストが必要になったらここに追加
    }
}

publishing {
    publications {
        create<MavenPublication>("tokensCompose") {
            from(components["java"])
            groupId = "com.tzie"
            artifactId = "tokens-compose"
            version = project.version.toString()
        }
    }
    // 実際にどこへpublishするかは環境に合わせて：
    // repositories {
    //     maven {
    //         url = uri("https://maven.pkg.github.com/your-org/your-repo")
    //         credentials { ... }
    //     }
    // }
}
