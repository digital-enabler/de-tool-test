FROM eclipse-temurin:20-jre-jammy AS Builder
WORKDIR source
COPY /target/app.jar application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM eclipse-temurin:20-jre-jammy
WORKDIR app
COPY --from=builder source/dependencies/ ./
COPY --from=builder source/spring-boot-loader/ ./
COPY --from=builder source/snapshot-dependencies/ ./
COPY --from=builder source/application/ ./
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]