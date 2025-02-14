export function getTimestampByYMD(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()); 
    return Math.floor(utcMidnight / 1000);
};

export const conversationData = {
    "edges": [
        {
            "applications": [],
            "bytes": 20014,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6Host:10.1.5.89",
            "label": "tcp/389",
            "protocols": [
                "tcp"
            ],
            "source": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "status": "OK",
            "target": "Host:10.1.5.89",
            "toDomain": "nvUnmanagedNode",
            "toGroup": "Host:10.1.5.89"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 840347230,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6external",
            "label": "SSL,tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "status": "OK",
            "target": "external",
            "toDomain": "external",
            "toGroup": "external"
        },
        {
            "applications": [
                "DNS"
            ],
            "bytes": 201294,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "label": "DNS",
            "protocols": [
                "udp"
            ],
            "source": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "status": "OK",
            "target": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "toDomain": "kube-system",
            "toGroup": "nv.coredns.kube-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 540768,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc664cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "status": "intraGroup",
            "target": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 1751644449,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6nv.ip.kubernetes.default",
            "label": "SSL,tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 544085,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "status": "intraGroup",
            "target": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [],
            "bytes": 3476963,
            "event_type": [],
            "fromDomain": "cert-manager",
            "fromGroup": "nv.cert-manager-webhook.cert-manager",
            "id": "84b3bea5d57e6c42e95239cb3640b7b102c1663b9999b05c146ca597900836aanv.ip.kubernetes.default",
            "label": "tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "84b3bea5d57e6c42e95239cb3640b7b102c1663b9999b05c146ca597900836aa",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 38190,
            "event_type": [],
            "fromDomain": "nvUnmanagedNode",
            "fromGroup": "Host:10.1.7.133",
            "id": "Host:10.1.7.1336749bed67b039b9672790c5507c2e4f7f245031e2cab58f2a67ec49e4e066e11",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "Host:10.1.7.133",
            "status": "OK",
            "target": "6749bed67b039b9672790c5507c2e4f7f245031e2cab58f2a67ec49e4e066e11",
            "toDomain": "kube-system",
            "toGroup": "nv.svclb-traefik.kube-system"
        },
        {
            "applications": [
                "HTTP",
                "SSL"
            ],
            "bytes": 83336813,
            "event_type": [],
            "fromDomain": "nvUnmanagedWorkload",
            "fromGroup": "Workload:ingress",
            "id": "Workload:ingressc595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "label": "HTTP,SSL,tcp/444",
            "protocols": [
                "tcp"
            ],
            "source": "Workload:ingress",
            "status": "OK",
            "target": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [
                "HTTP"
            ],
            "bytes": 65352998,
            "event_type": [],
            "fromDomain": "nvUnmanagedWorkload",
            "fromGroup": "Workload:ingress",
            "id": "Workload:ingress84b3bea5d57e6c42e95239cb3640b7b102c1663b9999b05c146ca597900836aa",
            "label": "HTTP,tcp/6080",
            "protocols": [
                "tcp"
            ],
            "source": "Workload:ingress",
            "status": "OK",
            "target": "84b3bea5d57e6c42e95239cb3640b7b102c1663b9999b05c146ca597900836aa",
            "toDomain": "cert-manager",
            "toGroup": "nv.cert-manager-webhook.cert-manager"
        },
        {
            "applications": [
                "HTTP"
            ],
            "bytes": 23460534,
            "event_type": [],
            "fromDomain": "nvUnmanagedWorkload",
            "fromGroup": "Workload:ingress",
            "id": "Workload:ingress68f554fd2a4a1fe961bf1e2c58ccd403cda9a3e7ebb42cd97ada77c5c76ce801",
            "label": "HTTP",
            "protocols": [
                "tcp"
            ],
            "source": "Workload:ingress",
            "status": "OK",
            "target": "68f554fd2a4a1fe961bf1e2c58ccd403cda9a3e7ebb42cd97ada77c5c76ce801",
            "toDomain": "cert-manager",
            "toGroup": "nv.cert-manager.cert-manager"
        },
        {
            "applications": [
                "HTTP",
                "SSL"
            ],
            "bytes": 132432811,
            "event_type": [],
            "fromDomain": "nvUnmanagedWorkload",
            "fromGroup": "Workload:ingress",
            "id": "Workload:ingress4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "label": "HTTP,SSL,tcp/444",
            "protocols": [
                "tcp"
            ],
            "source": "Workload:ingress",
            "status": "OK",
            "target": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [
                "HTTP",
                "SSL"
            ],
            "bytes": 294314127,
            "event_type": [],
            "fromDomain": "nvUnmanagedWorkload",
            "fromGroup": "Workload:ingress",
            "id": "Workload:ingress64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "label": "HTTP,SSL,tcp/444",
            "protocols": [
                "tcp"
            ],
            "source": "Workload:ingress",
            "status": "OK",
            "target": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [
                "SSL",
                "HTTP"
            ],
            "bytes": 554558192,
            "event_type": [],
            "fromDomain": "nvUnmanagedWorkload",
            "fromGroup": "Workload:ingress",
            "id": "Workload:ingress7d2062e154aa3654780c58a080c5520ceca49e0a17c61332d856b88b6c21b1ce",
            "label": "SSL,HTTP,tcp/9443",
            "protocols": [
                "tcp"
            ],
            "source": "Workload:ingress",
            "status": "OK",
            "target": "7d2062e154aa3654780c58a080c5520ceca49e0a17c61332d856b88b6c21b1ce",
            "toDomain": "cattle-provisioning-capi-system",
            "toGroup": "nv.capi-controller-manager.cattle-provisioning-capi-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 735496010,
            "event_type": [],
            "fromDomain": "nvUnmanagedWorkload",
            "fromGroup": "Workload:ingress",
            "id": "Workload:ingressab0af10f05c9cff4110eb75f624cd922f0357eb25f7c0eaea930b2987ecb416c",
            "label": "SSL,tcp/10250",
            "protocols": [
                "tcp"
            ],
            "source": "Workload:ingress",
            "status": "OK",
            "target": "ab0af10f05c9cff4110eb75f624cd922f0357eb25f7c0eaea930b2987ecb416c",
            "toDomain": "kube-system",
            "toGroup": "nv.metrics-server.kube-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 3282812391,
            "event_type": [],
            "fromDomain": "nvUnmanagedWorkload",
            "fromGroup": "Workload:ingress",
            "id": "Workload:ingressa80431ee9ec20228db5eb089475d5dab15b25b2ae0743bdc2627c11968d874a6",
            "label": "SSL,tcp/9443",
            "protocols": [
                "tcp"
            ],
            "source": "Workload:ingress",
            "status": "OK",
            "target": "a80431ee9ec20228db5eb089475d5dab15b25b2ae0743bdc2627c11968d874a6",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher-webhook.cattle-system"
        },
        {
            "applications": [
                "HTTP",
                "SSL"
            ],
            "bytes": 132713954,
            "event_type": [],
            "fromDomain": "nvUnmanagedWorkload",
            "fromGroup": "Workload:ingress",
            "id": "Workload:ingressfb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc",
            "label": "HTTP,SSL,tcp/8443",
            "protocols": [
                "tcp"
            ],
            "source": "Workload:ingress",
            "status": "OK",
            "target": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc",
            "toDomain": "kube-system",
            "toGroup": "nv.traefik.kube-system"
        },
        {
            "applications": [
                "HTTP"
            ],
            "bytes": 135060242,
            "event_type": [],
            "fromDomain": "nvUnmanagedWorkload",
            "fromGroup": "Workload:ingress",
            "id": "Workload:ingressfb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "label": "HTTP,tcp/8080,tcp/8181",
            "protocols": [
                "tcp"
            ],
            "source": "Workload:ingress",
            "status": "OK",
            "target": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "toDomain": "kube-system",
            "toGroup": "nv.coredns.kube-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 65100,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.svclb-traefik.kube-system",
            "id": "6749bed67b039b9672790c5507c2e4f7f245031e2cab58f2a67ec49e4e066e11fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "6749bed67b039b9672790c5507c2e4f7f245031e2cab58f2a67ec49e4e066e11",
            "status": "OK",
            "target": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc",
            "toDomain": "kube-system",
            "toGroup": "nv.traefik.kube-system"
        },
        {
            "applications": [
                "DNS"
            ],
            "bytes": 200035,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.coredns.kube-system",
            "id": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4fexternal",
            "label": "DNS",
            "protocols": [
                "udp"
            ],
            "source": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "status": "OK",
            "target": "external",
            "toDomain": "external",
            "toGroup": "external"
        },
        {
            "applications": [
                "DNS"
            ],
            "bytes": 191915,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.coredns.kube-system",
            "id": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4fHost:10.1.5.89",
            "label": "DNS",
            "protocols": [
                "udp"
            ],
            "source": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "status": "OK",
            "target": "Host:10.1.5.89",
            "toDomain": "nvUnmanagedNode",
            "toGroup": "Host:10.1.5.89"
        },
        {
            "applications": [],
            "bytes": 5418556,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.coredns.kube-system",
            "id": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4fnv.ip.kubernetes.default",
            "label": "tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [],
            "bytes": 67100007,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher-webhook.cattle-system",
            "id": "a80431ee9ec20228db5eb089475d5dab15b25b2ae0743bdc2627c11968d874a6nv.ip.kubernetes.default",
            "label": "tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "a80431ee9ec20228db5eb089475d5dab15b25b2ae0743bdc2627c11968d874a6",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 2452868365,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535nv.ip.kubernetes.default",
            "label": "SSL,tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [],
            "bytes": 20022,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535Host:10.1.5.89",
            "label": "tcp/389",
            "protocols": [
                "tcp"
            ],
            "source": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "status": "OK",
            "target": "Host:10.1.5.89",
            "toDomain": "nvUnmanagedNode",
            "toGroup": "Host:10.1.5.89"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 628789176,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535external",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "status": "OK",
            "target": "external",
            "toDomain": "external",
            "toGroup": "external"
        },
        {
            "applications": [
                "DNS"
            ],
            "bytes": 252849,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "label": "DNS",
            "protocols": [
                "udp"
            ],
            "source": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "status": "OK",
            "target": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "toDomain": "kube-system",
            "toGroup": "nv.coredns.kube-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 1660529,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af905354f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "status": "intraGroup",
            "target": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 1206481,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af9053564cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "status": "intraGroup",
            "target": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 68560135,
            "event_type": [],
            "fromDomain": "cattle-fleet-system",
            "fromGroup": "nv.gitjob.cattle-fleet-system",
            "id": "9c531079a757855e3247bb4d73040349f931ef5aaa66416348e2a8e12193d45dnv.ip.kubernetes.default",
            "label": "SSL,tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "9c531079a757855e3247bb4d73040349f931ef5aaa66416348e2a8e12193d45d",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 407537897,
            "event_type": [],
            "fromDomain": "cattle-provisioning-capi-system",
            "fromGroup": "nv.capi-controller-manager.cattle-provisioning-capi-system",
            "id": "7d2062e154aa3654780c58a080c5520ceca49e0a17c61332d856b88b6c21b1cenv.ip.kubernetes.default",
            "label": "SSL,tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "7d2062e154aa3654780c58a080c5520ceca49e0a17c61332d856b88b6c21b1ce",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 26910,
            "event_type": [],
            "fromDomain": "nvUnmanagedNode",
            "fromGroup": "Host:10.1.7.131",
            "id": "Host:10.1.7.1316749bed67b039b9672790c5507c2e4f7f245031e2cab58f2a67ec49e4e066e11",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "Host:10.1.7.131",
            "status": "OK",
            "target": "6749bed67b039b9672790c5507c2e4f7f245031e2cab58f2a67ec49e4e066e11",
            "toDomain": "kube-system",
            "toGroup": "nv.svclb-traefik.kube-system"
        },
        {
            "applications": [],
            "bytes": 21238219,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.system-upgrade-controller.cattle-system",
            "id": "c5ae747adf5f6966064acb79c419a85d143cd4f7d477b16a041678853855d4d2nv.ip.kubernetes.default",
            "label": "tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "c5ae747adf5f6966064acb79c419a85d143cd4f7d477b16a041678853855d4d2",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 538032,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "status": "intraGroup",
            "target": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 457812369,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050external",
            "label": "SSL,tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "status": "OK",
            "target": "external",
            "toDomain": "external",
            "toGroup": "external"
        },
        {
            "applications": [],
            "bytes": 134438,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050Host:10.1.5.89",
            "label": "tcp/389",
            "protocols": [
                "tcp"
            ],
            "source": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "status": "OK",
            "target": "Host:10.1.5.89",
            "toDomain": "nvUnmanagedNode",
            "toGroup": "Host:10.1.5.89"
        },
        {
            "applications": [
                "DNS"
            ],
            "bytes": 1618668,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "label": "DNS",
            "protocols": [
                "udp"
            ],
            "source": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "status": "OK",
            "target": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "toDomain": "kube-system",
            "toGroup": "nv.coredns.kube-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 543807,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a90504f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "status": "intraGroup",
            "target": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 2676783065,
            "event_type": [],
            "fromDomain": "cattle-system",
            "fromGroup": "nv.rancher.cattle-system",
            "id": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050nv.ip.kubernetes.default",
            "label": "SSL,tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [
                "DNS"
            ],
            "bytes": 3786,
            "event_type": [],
            "fromDomain": "demo",
            "fromGroup": "nv.nv-test.demo",
            "id": "b616a1a2e089d534215e046f70248872c90850c1e0390cd3632168f6fc513a27fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "label": "DNS",
            "protocols": [
                "udp"
            ],
            "source": "b616a1a2e089d534215e046f70248872c90850c1e0390cd3632168f6fc513a27",
            "status": "OK",
            "target": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "toDomain": "kube-system",
            "toGroup": "nv.coredns.kube-system"
        },
        {
            "applications": [],
            "bytes": 6467268,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.local-path-provisioner.kube-system",
            "id": "1050e6fe34d1926cff2004f476f3b1fe5fb8302009886f87f61dc0dc21c196cfnv.ip.kubernetes.default",
            "label": "tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "1050e6fe34d1926cff2004f476f3b1fe5fb8302009886f87f61dc0dc21c196cf",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 3599855,
            "event_type": [],
            "fromDomain": "cattle-fleet-local-system",
            "fromGroup": "nv.fleet-agent.cattle-fleet-local-system",
            "id": "4183f191b85231eeabac6e5ecb26a2dde24fd369d62789f6112a3a73db5f24fcnv.ip.kubernetes.default",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "4183f191b85231eeabac6e5ecb26a2dde24fd369d62789f6112a3a73db5f24fc",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [],
            "bytes": 34387321,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.metrics-server.kube-system",
            "id": "ab0af10f05c9cff4110eb75f624cd922f0357eb25f7c0eaea930b2987ecb416cnv.ip.kubernetes.default",
            "label": "tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "ab0af10f05c9cff4110eb75f624cd922f0357eb25f7c0eaea930b2987ecb416c",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [],
            "bytes": 63615760,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.metrics-server.kube-system",
            "id": "ab0af10f05c9cff4110eb75f624cd922f0357eb25f7c0eaea930b2987ecb416cHost:ubuntu2204-auto2:564da35a-b0a8-6df6-00df-005c2f222459",
            "label": "tcp/10250",
            "protocols": [
                "tcp"
            ],
            "source": "ab0af10f05c9cff4110eb75f624cd922f0357eb25f7c0eaea930b2987ecb416c",
            "status": "OK",
            "target": "Host:ubuntu2204-auto2:564da35a-b0a8-6df6-00df-005c2f222459",
            "toDomain": "nvManagedNode",
            "toGroup": "nodes"
        },
        {
            "applications": [
                "HTTP"
            ],
            "bytes": 259290442,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.traefik.kube-system",
            "id": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "label": "HTTP,tcp/80",
            "protocols": [
                "tcp"
            ],
            "source": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc",
            "status": "OK",
            "target": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [],
            "bytes": 46217555,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.traefik.kube-system",
            "id": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fcnv.ip.kubernetes.default",
            "label": "tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [
                "HTTP"
            ],
            "bytes": 19639896,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.traefik.kube-system",
            "id": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fcc595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "label": "HTTP",
            "protocols": [
                "tcp"
            ],
            "source": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc",
            "status": "OK",
            "target": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 165983,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.traefik.kube-system",
            "id": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fcexternal",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc",
            "status": "OK",
            "target": "external",
            "toDomain": "external",
            "toGroup": "external"
        },
        {
            "applications": [
                "DNS"
            ],
            "bytes": 15741,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.traefik.kube-system",
            "id": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fcfb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "label": "DNS",
            "protocols": [
                "udp"
            ],
            "source": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc",
            "status": "OK",
            "target": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "toDomain": "kube-system",
            "toGroup": "nv.coredns.kube-system"
        },
        {
            "applications": [
                "HTTP"
            ],
            "bytes": 17879794,
            "event_type": [],
            "fromDomain": "kube-system",
            "fromGroup": "nv.traefik.kube-system",
            "id": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "label": "HTTP,tcp/80",
            "protocols": [
                "tcp"
            ],
            "source": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc",
            "status": "OK",
            "target": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 68454870,
            "event_type": [],
            "fromDomain": "cert-manager",
            "fromGroup": "nv.cert-manager.cert-manager",
            "id": "68f554fd2a4a1fe961bf1e2c58ccd403cda9a3e7ebb42cd97ada77c5c76ce801nv.ip.kubernetes.default",
            "label": "SSL,tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "68f554fd2a4a1fe961bf1e2c58ccd403cda9a3e7ebb42cd97ada77c5c76ce801",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 53166020,
            "event_type": [],
            "fromDomain": "cert-manager",
            "fromGroup": "nv.cert-manager-cainjector.cert-manager",
            "id": "bad5a1e26aeb1308c59025690bfd760e276f2f80fc8eb16b8e198339ee0d4d57nv.ip.kubernetes.default",
            "label": "SSL,tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "bad5a1e26aeb1308c59025690bfd760e276f2f80fc8eb16b8e198339ee0d4d57",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 172009,
            "event_type": [],
            "fromDomain": "cattle-fleet-system",
            "fromGroup": "nv.fleet-controller.cattle-fleet-system",
            "id": "a15a9e27bb8bd2aec16137368742f6cbd679b83d7bbbe7454e6c10a4dbf37e56c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "label": "SSL",
            "protocols": [
                "tcp"
            ],
            "source": "a15a9e27bb8bd2aec16137368742f6cbd679b83d7bbbe7454e6c10a4dbf37e56",
            "status": "OK",
            "target": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "toDomain": "cattle-system",
            "toGroup": "nv.rancher.cattle-system"
        },
        {
            "applications": [
                "SSL"
            ],
            "bytes": 290528405,
            "event_type": [],
            "fromDomain": "cattle-fleet-system",
            "fromGroup": "nv.fleet-controller.cattle-fleet-system",
            "id": "a15a9e27bb8bd2aec16137368742f6cbd679b83d7bbbe7454e6c10a4dbf37e56nv.ip.kubernetes.default",
            "label": "SSL,tcp/443",
            "protocols": [
                "tcp"
            ],
            "source": "a15a9e27bb8bd2aec16137368742f6cbd679b83d7bbbe7454e6c10a4dbf37e56",
            "status": "OK",
            "target": "nv.ip.kubernetes.default",
            "toDomain": "default",
            "toGroup": "nv.ip.kubernetes.default"
        }
    ],
    "nodes": [
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "6c2cc67e3875afb21b51591994c3dbc6e7a026ee4b86f0d5f41fbb6d3883544e",
                    "label": "rancher",
                    "scanBrief": {
                        "high": 0,
                        "medium": 0,
                        "status": "scanning"
                    },
                    "sidecar": false
                },
                {
                    "id": "540812d44eb1c745cb114ffd1130c925bd007313ba77c13cbea2346c9e485d7a",
                    "label": "rancher",
                    "scanBrief": {
                        "high": 25,
                        "medium": 44,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.rancher.cattle-system",
            "clusterName": "rancher",
            "domain": "cattle-system",
            "group": "containerDiscover",
            "id": "4f8b8415ef48a518d83e098fb4c1bca896f3973ce1d5104b7bd1af48e2111bc6",
            "label": "rancher-fbc786f5b-nj85w",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 25,
                "medium": 44,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738540800
        },
        {
            "cap_change_mode": false,
            "cap_quarantine": false,
            "cap_sniff": false,
            "clusterId": "Host:10.1.5.89",
            "clusterName": "Host:10.1.5.89",
            "domain": "nvUnmanagedNode",
            "group": "node_ip",
            "id": "Host:10.1.5.89",
            "label": "10.1.5.89",
            "platform_role": "",
            "policyMode": "",
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "connected",
            "timestamp": 1737849600
        },
        {
            "cap_change_mode": false,
            "cap_quarantine": false,
            "cap_sniff": false,
            "clusterId": "external",
            "clusterName": "external",
            "domain": "external",
            "group": "external",
            "id": "external",
            "label": "External Network",
            "platform_role": "",
            "policyMode": "",
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "connected",
            "timestamp": 1738022400
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": false,
            "cap_sniff": true,
            "children": [
                {
                    "id": "c04d1b5b4bf23cc4b1b942406b16a1da0f5cc35cc07f9ae67ca44125875bf6f9",
                    "label": "coredns",
                    "scanBrief": {
                        "high": 5,
                        "medium": 6,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.coredns.kube-system",
            "clusterName": "coredns",
            "domain": "kube-system",
            "group": "containerDiscover",
            "id": "fb92255b4ff7c75ca2a4ccb674dd1dcf0ae87e2cb0bbf23bec77b40fe8d95b4f",
            "label": "coredns-6799fbcd5-nx9n4",
            "platform_role": "System",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 5,
                "medium": 6,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738454400
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "a1cb225ea623f55e4adb063f589c52454121d9e63ea0dedc32a9c7543e115044",
                    "label": "rancher",
                    "scanBrief": {
                        "high": 25,
                        "medium": 44,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "1e3594fd6d41774950246209b060a9d462ec052188df1c6ed34278435f043419",
                    "label": "rancher",
                    "scanBrief": {
                        "high": 0,
                        "medium": 0,
                        "status": "scanning"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.rancher.cattle-system",
            "clusterName": "rancher",
            "domain": "cattle-system",
            "group": "containerDiscover",
            "id": "64cd01ada91d4b2f0a9e30cd78f6aa3ff6031ff1ed2da33db859828ba13a9050",
            "label": "rancher-fbc786f5b-jnwrl",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 25,
                "medium": 44,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738454400
        },
        {
            "cap_change_mode": false,
            "cap_quarantine": false,
            "cap_sniff": false,
            "clusterId": "nv.ip.kubernetes.default",
            "clusterName": "ip.kubernetes",
            "domain": "default",
            "group": "ip_service",
            "id": "nv.ip.kubernetes.default",
            "label": "nv.ip.kubernetes.default",
            "platform_role": "",
            "policyMode": "",
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "connected",
            "timestamp": 1738195200
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "d27b68c9b8458cfe2bb7d475437ef60770e41c58f1e419da685565262146b9d4",
                    "label": "rancher",
                    "scanBrief": {
                        "high": 0,
                        "medium": 0,
                        "status": "scanning"
                    },
                    "sidecar": false
                },
                {
                    "id": "2497fb86f9ba046ad272c009054c56f9c20bfa776de3ec707965d014c517e064",
                    "label": "rancher",
                    "scanBrief": {
                        "high": 25,
                        "medium": 44,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.rancher.cattle-system",
            "clusterName": "rancher",
            "domain": "cattle-system",
            "group": "containerDiscover",
            "id": "c595c9c74fdcfb8d5da745eb685638684504322c38eaae8796854b568af90535",
            "label": "rancher-fbc786f5b-29z24",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 25,
                "medium": 44,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738368000
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "699b0d546e82e2c2ea9f1cc98c5d05a20d6eca3b59997313f35097a40f95bbf3",
                    "label": "cert-manager-webhook",
                    "scanBrief": {
                        "high": 1,
                        "medium": 1,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.cert-manager-webhook.cert-manager",
            "clusterName": "cert-manager-webhook",
            "domain": "cert-manager",
            "group": "containerDiscover",
            "id": "84b3bea5d57e6c42e95239cb3640b7b102c1663b9999b05c146ca597900836aa",
            "label": "cert-manager-webhook-8656b957f-wnw8d",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 1,
                "medium": 1,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738454400
        },
        {
            "cap_change_mode": false,
            "cap_quarantine": false,
            "cap_sniff": false,
            "clusterId": "Host:10.1.7.133",
            "clusterName": "Host:10.1.7.133",
            "domain": "nvUnmanagedNode",
            "group": "node_ip",
            "id": "Host:10.1.7.133",
            "label": "10.1.7.133",
            "platform_role": "",
            "policyMode": "",
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "connected",
            "timestamp": 1738108800
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": false,
            "cap_sniff": true,
            "children": [
                {
                    "id": "980f350a3263fec23a4efed7790f0910be1c74859744f6d7a9d4d7aed849d8ad",
                    "label": "lb-tcp-443",
                    "scanBrief": {
                        "high": 3,
                        "medium": 6,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "e98abf9c5c6b13426fe9edbb2f622cbf8302c479befe8e143e39c579d9d0b0fd",
                    "label": "lb-tcp-80",
                    "scanBrief": {
                        "high": 3,
                        "medium": 6,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.svclb-traefik.kube-system",
            "clusterName": "svclb-traefik",
            "domain": "kube-system",
            "group": "containerDiscover",
            "id": "6749bed67b039b9672790c5507c2e4f7f245031e2cab58f2a67ec49e4e066e11",
            "label": "svclb-traefik-1243051f-h7msm",
            "platform_role": "System",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 6,
                "medium": 12,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1737763200
        },
        {
            "cap_change_mode": false,
            "cap_quarantine": false,
            "cap_sniff": false,
            "clusterId": "Workload:ingress",
            "clusterName": "Workload:ingress",
            "domain": "nvUnmanagedWorkload",
            "group": "workload_ip",
            "id": "Workload:ingress",
            "label": "ingress",
            "platform_role": "",
            "policyMode": "",
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "connected",
            "timestamp": 1738368000
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "c51f0ac6585031d28bb0071425315e731b712c331eaa81fa2136a138fc459f55",
                    "label": "cert-manager-controller",
                    "scanBrief": {
                        "high": 1,
                        "medium": 1,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "03c5a334a8b83a72a88a28f30a2dbd5b024231dff3462a4609175748ef68e4cc",
                    "label": "cert-manager-controller",
                    "scanBrief": {
                        "high": 1,
                        "medium": 1,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.cert-manager.cert-manager",
            "clusterName": "cert-manager",
            "domain": "cert-manager",
            "group": "containerDiscover",
            "id": "68f554fd2a4a1fe961bf1e2c58ccd403cda9a3e7ebb42cd97ada77c5c76ce801",
            "label": "cert-manager-d548d744-mmrsr",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 1,
                "medium": 1,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1737763200
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "4c915db4d06bcc02e969b624d7604122a0187b286af58a74ae9f0cd3e0050ca5",
                    "label": "manager",
                    "scanBrief": {
                        "high": 1,
                        "medium": 1,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "cdd574008d0c0d5b995b384cd72db0fcdad2505f2fe58a0b6bccc8f85a224387",
                    "label": "manager",
                    "scanBrief": {
                        "high": 1,
                        "medium": 1,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.capi-controller-manager.cattle-provisioning-capi-system",
            "clusterName": "capi-controller-manager",
            "domain": "cattle-provisioning-capi-system",
            "group": "containerDiscover",
            "id": "7d2062e154aa3654780c58a080c5520ceca49e0a17c61332d856b88b6c21b1ce",
            "label": "capi-controller-manager-787d8dfd49-q2cdj",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 1,
                "medium": 1,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738022400
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": false,
            "cap_sniff": true,
            "children": [
                {
                    "id": "398be1d4174b51e50c95abb3bc59c3c9fa46f7be5f7c89ffb5390d6d48f2b264",
                    "label": "metrics-server",
                    "scanBrief": {
                        "high": 2,
                        "medium": 3,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.metrics-server.kube-system",
            "clusterName": "metrics-server",
            "domain": "kube-system",
            "group": "containerDiscover",
            "id": "ab0af10f05c9cff4110eb75f624cd922f0357eb25f7c0eaea930b2987ecb416c",
            "label": "metrics-server-54fd9b65b-8zjw8",
            "platform_role": "System",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 2,
                "medium": 3,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1737763200
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "107345d7cc6fe39b5e9e94518d31a8ebfb2a468941187d0dca61f41cac53690b",
                    "label": "rancher-webhook",
                    "scanBrief": {
                        "high": 1,
                        "medium": 1,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.rancher-webhook.cattle-system",
            "clusterName": "rancher-webhook",
            "domain": "cattle-system",
            "group": "containerDiscover",
            "id": "a80431ee9ec20228db5eb089475d5dab15b25b2ae0743bdc2627c11968d874a6",
            "label": "rancher-webhook-577cc7f684-pcxqv",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 1,
                "medium": 1,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738022400
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": false,
            "cap_sniff": true,
            "children": [
                {
                    "id": "afad83bd8f54911caafc4f42b1fc0bc9a32142a52a11ffbbd2147e085de25760",
                    "label": "traefik",
                    "scanBrief": {
                        "high": 8,
                        "medium": 20,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.traefik.kube-system",
            "clusterName": "traefik",
            "domain": "kube-system",
            "group": "containerDiscover",
            "id": "fb83c2b00627a794fe62c5db2def3b33391578a293d563183995389d084006fc",
            "label": "traefik-7d5f6474df-2pzjg",
            "platform_role": "System",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 8,
                "medium": 20,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738195200
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "6847ea671d5bbb70282579c1e2252ff4d7701dc6f7a201c62089d49fdfa58002",
                    "label": "gitjob",
                    "scanBrief": {
                        "high": 7,
                        "medium": 4,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "9e8548670d61813bf2f2ac251eb762734c0e13cc74bee6b31a12c2a2a26c90c5",
                    "label": "gitjob",
                    "scanBrief": {
                        "high": 7,
                        "medium": 4,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.gitjob.cattle-fleet-system",
            "clusterName": "gitjob",
            "domain": "cattle-fleet-system",
            "group": "containerDiscover",
            "id": "9c531079a757855e3247bb4d73040349f931ef5aaa66416348e2a8e12193d45d",
            "label": "gitjob-7d56b6886c-ncd52",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 7,
                "medium": 4,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738022400
        },
        {
            "cap_change_mode": false,
            "cap_quarantine": false,
            "cap_sniff": false,
            "clusterId": "Host:10.1.7.131",
            "clusterName": "Host:10.1.7.131",
            "domain": "nvUnmanagedNode",
            "group": "node_ip",
            "id": "Host:10.1.7.131",
            "label": "10.1.7.131",
            "platform_role": "",
            "policyMode": "",
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "connected",
            "timestamp": 1738108800
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "c85ebfba47783ef0df3d45da11f420703d80eb96ccaecfbabcfcaf1d225a4160",
                    "label": "system-upgrade-controller",
                    "scanBrief": {
                        "high": 0,
                        "medium": 1,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.system-upgrade-controller.cattle-system",
            "clusterName": "system-upgrade-controller",
            "domain": "cattle-system",
            "group": "containerDiscover",
            "id": "c5ae747adf5f6966064acb79c419a85d143cd4f7d477b16a041678853855d4d2",
            "label": "system-upgrade-controller-646f9548cc-9btvp",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 0,
                "medium": 1,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738540800
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "4cb612e565ad5f83b901382958ef09aa7d80ddb8a044ecec73d8dfd874a78e60",
                    "label": "container-0",
                    "scanBrief": {
                        "high": 1110,
                        "medium": 661,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.nv-test.demo",
            "clusterName": "nv-test",
            "domain": "demo",
            "group": "containerDiscover",
            "id": "b616a1a2e089d534215e046f70248872c90850c1e0390cd3632168f6fc513a27",
            "label": "nv-test-node",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 1110,
                "medium": 661,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738281600
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": false,
            "cap_sniff": true,
            "children": [
                {
                    "id": "47c37c2363cff5a548377aadb5d3227c52f8c642507c18dbfa555cd4a4093b6e",
                    "label": "local-path-provisioner",
                    "scanBrief": {
                        "high": 5,
                        "medium": 6,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.local-path-provisioner.kube-system",
            "clusterName": "local-path-provisioner",
            "domain": "kube-system",
            "group": "containerDiscover",
            "id": "1050e6fe34d1926cff2004f476f3b1fe5fb8302009886f87f61dc0dc21c196cf",
            "label": "local-path-provisioner-6f5d79df6-dld2z",
            "platform_role": "System",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 5,
                "medium": 6,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1737936000
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "8040ae991e7683a101efbfb8f49daefefe88d0696308be94ceee51ebd7ac154a",
                    "label": "fleet-agent-register",
                    "scanBrief": {
                        "high": 0,
                        "medium": 0,
                        "status": "scanning"
                    },
                    "sidecar": false
                },
                {
                    "id": "b2c9373179bfaed03678008e84d536c2cbf26c1a1e9bab9331189d5781fdf926",
                    "label": "fleet-agent-clusterstatus",
                    "scanBrief": {
                        "high": 1,
                        "medium": 1,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "e1a9a4dee348f1c2e69aa9a9e3e7449095a65bf85d36ba089bfd9be11e5f9d52",
                    "label": "fleet-agent",
                    "scanBrief": {
                        "high": 1,
                        "medium": 1,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.fleet-agent.cattle-fleet-local-system",
            "clusterName": "fleet-agent",
            "domain": "cattle-fleet-local-system",
            "group": "containerDiscover",
            "id": "4183f191b85231eeabac6e5ecb26a2dde24fd369d62789f6112a3a73db5f24fc",
            "label": "fleet-agent-0",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 2,
                "medium": 2,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738108800
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": false,
            "cap_sniff": false,
            "clusterId": "nodes",
            "clusterName": "nodes",
            "domain": "nvManagedNode",
            "group": "hostDiscover",
            "id": "Host:ubuntu2204-auto2:564da35a-b0a8-6df6-00df-005c2f222459",
            "label": "ubuntu2204-auto2",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 1034,
                "medium": 4321,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "connected",
            "timestamp": 1737936000
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "cfd2fa606d200ef75cb29d06b07f97b7587bbd089955241f3c294c17c4cf4d4f",
                    "label": "cert-manager-cainjector",
                    "scanBrief": {
                        "high": 0,
                        "medium": 1,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "fa40f0bb861001cc75abd93bc97b891c042ed0bb91348595d23210a6cfb0c2ca",
                    "label": "cert-manager-cainjector",
                    "scanBrief": {
                        "high": 0,
                        "medium": 1,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.cert-manager-cainjector.cert-manager",
            "clusterName": "cert-manager-cainjector",
            "domain": "cert-manager",
            "group": "containerDiscover",
            "id": "bad5a1e26aeb1308c59025690bfd760e276f2f80fc8eb16b8e198339ee0d4d57",
            "label": "cert-manager-cainjector-57fd464d97-z5h6r",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 0,
                "medium": 1,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738454400
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "ef773d07951a811819072e93f830679e30300a7efa40e3bd7c0a92911d63b159",
                    "label": "fleet-agentmanagement",
                    "scanBrief": {
                        "high": 7,
                        "medium": 4,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "79a03e9db001b5839f7dbbe264348310acf728dcd9d69c4161657941ee144e75",
                    "label": "fleet-cleanup",
                    "scanBrief": {
                        "high": 7,
                        "medium": 4,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "e958450fe17566da06e1a8c09bad44c7c399302ba26aab3df12045e26c2e960f",
                    "label": "fleet-controller",
                    "scanBrief": {
                        "high": 7,
                        "medium": 4,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "a4bf9b0200188584fe0deaad94cc12764f0658e8d992c138ee4721d4faca3bf0",
                    "label": "fleet-controller",
                    "scanBrief": {
                        "high": 7,
                        "medium": 4,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "782a1ed0dec4fe5dcd4b1e27e6be3a96ca3173bdea2b11779a5fcb80a68b8c65",
                    "label": "fleet-agentmanagement",
                    "scanBrief": {
                        "high": 7,
                        "medium": 4,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "4e81544a544390a4fdc100a18cbb722fd77445fd53884b61bff45ca0f56bd5d4",
                    "label": "fleet-cleanup",
                    "scanBrief": {
                        "high": 7,
                        "medium": 4,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.fleet-controller.cattle-fleet-system",
            "clusterName": "fleet-controller",
            "domain": "cattle-fleet-system",
            "group": "containerDiscover",
            "id": "a15a9e27bb8bd2aec16137368742f6cbd679b83d7bbbe7454e6c10a4dbf37e56",
            "label": "fleet-controller-655f4d5bc6-2bs8v",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 21,
                "medium": 12,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738454400
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": false,
            "cap_sniff": true,
            "children": [
                {
                    "id": "aac2328d2ba9c311042a291004408580f1c90f446872fd7743e435cafc0c1df7",
                    "label": "lb-tcp-10443",
                    "scanBrief": {
                        "high": 3,
                        "medium": 6,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.svclb-neuvector-service-controller-fed-worker.kube-system",
            "clusterName": "svclb-neuvector-service-controller-fed-worker",
            "domain": "kube-system",
            "group": "containerDiscover",
            "id": "353be0c9fa89b8e874059fd93f3d143955f681e40c0161646d7db502254897e2",
            "label": "svclb-neuvector-service-controller-fed-worker-619c291d-wxqgr",
            "platform_role": "System",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 3,
                "medium": 6,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738281600
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": false,
            "cap_sniff": true,
            "children": [
                {
                    "id": "91e551bcd2c03cf18b18d245184824c9bf90f1f8db352528b8df6da9c24995e5",
                    "label": "lb-tcp-11443",
                    "scanBrief": {
                        "high": 3,
                        "medium": 6,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.svclb-neuvector-service-controller-fed-master.kube-system",
            "clusterName": "svclb-neuvector-service-controller-fed-master",
            "domain": "kube-system",
            "group": "containerDiscover",
            "id": "bbcf8c59eb3a30190de5ff694358db4c55049c2f49d9b3c74e538a593909f6a4",
            "label": "svclb-neuvector-service-controller-fed-master-dcae2f82-wnrcv",
            "platform_role": "System",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 3,
                "medium": 6,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738454400
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "00808f22ec6f4e4201f1a9bd0a9ac4fde18eb96abd9fabc282c555a6ab5946fb",
                    "label": "container-0",
                    "scanBrief": {
                        "high": 10,
                        "medium": 44,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.nv-test.demo",
            "clusterName": "nv-test",
            "domain": "demo",
            "group": "containerDiscover",
            "id": "1ebcd6dfd40b76f173fe6dc06e060adcce220c184c79c14beb126eb62fc5e511",
            "label": "nv-test-redis",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 10,
                "medium": 44,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738540800
        },
        {
            "cap_change_mode": true,
            "cap_quarantine": true,
            "cap_sniff": true,
            "children": [
                {
                    "id": "0be329169e23f0d5fc016e93821ffbbab03a89ecbd18fa3f01416fc32899a74e",
                    "label": "alpine",
                    "scanBrief": {
                        "high": 0,
                        "medium": 0,
                        "status": "finished"
                    },
                    "sidecar": false
                },
                {
                    "id": "9918e874d859b694a4e7d05ca774f83a94b3f0e8b5ee6b7d63efae6aa6733837",
                    "label": "alpine",
                    "scanBrief": {
                        "high": 0,
                        "medium": 0,
                        "status": "finished"
                    },
                    "sidecar": false
                }
            ],
            "clusterId": "nv.alpine.demo",
            "clusterName": "alpine",
            "domain": "demo",
            "group": "containerDiscover",
            "id": "9bb2266bb87abab6c5d3074ae5d2e2aafe915844cfdb6ee5e79ff51435d3e56c",
            "label": "alpine",
            "platform_role": "",
            "policyMode": "Discover",
            "scanBrief": {
                "high": 0,
                "medium": 0,
                "status": "finished"
            },
            "service_mesh": false,
            "service_mesh_sidecar": false,
            "state": "discover",
            "timestamp": 1738108800
        }
    ]
};