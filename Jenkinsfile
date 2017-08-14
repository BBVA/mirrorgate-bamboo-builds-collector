#!groovy

BAMBOO_COLLECTOR_ARTIFACT = 'mirrorgate-bamboo-builds-collector.zip'

node ('global') {

    try {

        stage('Checkout') {
            checkout(scm)
        }

        stage('Build') {
            sh """
                docker-compose -p \${BUILD_TAG} run -u \$(id -u) install
            """
        }
        
        stage('Package Zip') {
            sh """
                docker-compose -p \${BUILD_TAG} run -u \$(id -u) package
            """
        }

        stage('Publish on Jenkins') {
      	    step([$class: "ArtifactArchiver", artifacts: "build/${BAMBOO_COLLECTOR_ARTIFACT}", fingerprint: true])
        }

    } catch(Exception e) {
        throw e;
    }
}
