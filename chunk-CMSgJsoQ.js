import {n}from'./chunk-BgZIKKzr.js';import {aX as It,v,aL as GT,aN as cd,aY as _y,a4 as k}from'./main-3RG2YP33.js';var g=class a{API_URL="https://api.spaceappschallenge.org/graphql";getHeaders(){return new It({accept:"*/*","accept-language":"pt-BR,pt;q=0.9,en;q=0.8,pt-PT;q=0.7","apollo-require-preflight":"true","content-type":"application/json",origin:"https://www.nasaspaceappsuberlandia.com.br",referer:"https://www.nasaspaceappsuberlandia.com.br/","x-client-origin":"https://www.spaceappschallenge.org","x-nextjs-server-side":"false",Cookie:this.getCookies()})}http=v(GT);byYear=new Map;getTeams(e=n){let t=this.byYear.get(e);return t||(t=this.http.get(`/assets/data/${e}/teams.json`).pipe(cd({error:()=>this.byYear.delete(e)}),_y({bufferSize:1,refCount:false})),this.byYear.set(e,t)),t}getCookies(){return "_ga=GA1.1.1478685271.1754529748; access_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1OTg1MDk1LCJpYXQiOjE3NTU5NzU0MzYsImp0aSI6IjdjNmQ4MDE0NTk4ZDRiMmViMmNlMDllNjQ1NDA0YWQ3IiwidXNlcl9pZCI6MzcxNTk4LCJjbGFpbV9jb2RlIjoiRjg1OUM1MzkyNDJCOUFDMDdCM0ZDMkI5Mzk4OEI4NTYiLCJ1dWlkIjoiZmQ1MDMyMDItODkxYy00NWQ2LThmNGItMTk5NWYyYmNjNDYzIiwiYXVkIjoiYXBpOjEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0NTY3OCIsImlzcyI6Imh0dHBzOi8vYWRtaW4uc3BhY2VhcHBzY2hhbGxlbmdlLm9yZy9hcGkifQ.XEi9brWhxZBeTgnP6FNvK7w7Hhu1FlbA9ZGRMaFIvQ1A73limMxgYE9AAr_cGq9isOz4dx7dSYV0-DKZ-LhnJtCaEDyH2zVUd2yellyvtKW7u-ajX_eaXRSTttyjVaE3x_JTGLedq9ce7d6nrXTp_sgJynQmaVPVH8Rl0CeGXps_I0Cl4vRWjBXHfIP9d-pfT43BVA4OUZBaRXJFazqDb0eTDzJStFIZyovgcm_dOg7PtQxGluWiFDQepzDS7E7GAnMS8C1w22yMmuYDX5iaQjbchvgCXGPdni-WQk_74DPd9sIOAyekVrG9DIGdXrmQm_tI1L72x_vAeZzlcW9Olw; refresh_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NjA3MTE5NSwiaWF0IjoxNzU1OTg0Nzk1LCJqdGkiOiJiNGNmZDYyZGJjNmU0NGViYmNhZjA1YjI1NWYxNjZiMSIsInVzZXJfaWQiOjM3MTU5OCwiY2xhaW1fY29kZSI6IkY4NTlDNTM5MjQyQjlBQzA3QjNGQzJCOTM5ODhCODU2IiwidXVpZCI6ImZkNTAzMjAyLTg5MWMtNDVkNi04ZjRiLTE5OTVmMmJjYzQ2MyIsImF1ZCI6ImFwaToxMjM0NTY3OC0xMjM0LTEyMzQtMTIzNDU2NzgiLCJpc3MiOiJodHRwczovL2FkbWluLnNwYWNlYXBwc2NoYWxsZW5nZS5vcmcvYXBpIn0.pjEjsrpmQedZGvJkzpx_nct5aZBVJeeKE1favi2l750G-2MH-Ia8w82SIRh-8G-zx1dV36KmyLri7Uiw3vYzbAI3psxUohY5azhfACk70g3L9X5HkYUnEVb4B8OvUub2xRlitpWDl2iDFxmd_ZzrOKir8px6Js4X_UhfVwNwQv5wfwxrs2Etyaqq-i69Fmh4WGCeytrlJscNo3gagIPKzFzftxis9XzbdXJyBV6ZNSC2FPCjlCzKbuHDAgwG8Dtebx1N9ROpDmg9TSQHYb83maYxJegad5Lphfl_UGwum0iU7UkyzIRC3D_TfSr8sJfftnS9BoVgyNdQRR63NV0zig; _ga_GBR0PYXEZR=GS2.1.s1755984799$o19$g0$t1755984799$j60$l0$h0"}getTeams1(e){let c=[{operationName:"Teams",variables:e,query:`
      query Teams($first: Int!, $after: String, $filtering: [Filter!], $q: String) {
        teams(first: $first, after: $after, filtering: $filtering, q: $q) {
          pageInfo {
            hasPreviousPage
            hasNextPage
            startCursor
            endCursor
            __typename
          }
          totalCount
          edges {
            __typename
            cursor
            node {
              __typename
              id
              ...CoreTeamFields
            }
          }
          __typename
        }
      }

      fragment CoreTeamFields on TeamPage {
        id
        title
        meta {
          ...ExpandedPageMetaFields
          __typename
        }
        owner
        ownerDetails {
          id
          username
          __typename
        }
        excerpt
        project
        projectDetails {
          ...CoreProjectFields
          __typename
        }
        projectSubmitted
        featuredImage {
          ...CustomImageFields
          __typename
        }
        description
        desiredSkills
        languages
        challenge
        challengeDetails {
          id
          title
          meta {
            ...ExpandedPageMetaFields
            __typename
          }
          excerpt
          __typename
        }
        location
        locationDetails {
          id
          title
          displayName
          meta {
            ...ExpandedPageMetaFields
            __typename
          }
          country
          __typename
        }
        event
        eventDetails {
          ...PublicEventFields
          __typename
        }
        joinEnabled
        memberships {
          user
          userDetails {
            id
            fullName
            username
            country
            avatar {
              ...CustomImageFields
              __typename
            }
            __typename
          }
          __typename
        }
        nominationBadges
        awardBadges
        __typename
      }

      fragment ExpandedPageMetaFields on ExpandedPageMeta {
        type
        slug
        firstPublishedAt
        lastPublishedAt
        relativeUrl
        live
        parent {
          id
          __typename
        }
        __typename
      }

      fragment CoreProjectFields on Project {
        id
        name
        summary
        demoLink
        projectLink
        details
        solution
        aiReferences
        dataReferences
        projectReferences
        isSubmitted
        savedAt
        submittedAt
        __typename
      }

      fragment CustomImageFields on DefaultImage {
        id
        meta {
          type
          downloadUrl
          __typename
        }
        title
        alt
        caption
        displaySize
        rendition {
          ...BaseImageFields
          __typename
        }
        __typename
      }

      fragment BaseImageFields on BaseImage {
        url
        fullUrl
        height
        width
        __typename
      }

      fragment PublicEventFields on GlobalEvent {
        ...CoreEventFields
        timezone
        teamMemberLimit
        eventRegistrationStatus
        localEventRegistrationStatus
        teamRegistrationStatus
        isTeamPagesActive
        isAwardsActive
        isChallengePagesActive
        localEventEditStatus
        teamEditStatus
        teamStreamEditStatus
        projectEditStatus
        localEventJudgingStatus
        nominationJudgingStatus
        projectFields {
          title
          caption
          fieldMapping
          fieldType
          __typename
        }
        __typename
      }

      fragment CoreEventFields on GlobalEvent {
        __typename
        id
        name
        displayName
        slug
        status
        startDate
        endDate
        certificate
        createRegistrationForm
        editRegistrationForm
        createTeamForm
      }
    `}],i=this.getHeaders(),s=this.getCookies();return s&&i.set("Cookie",s),this.http.post(this.API_URL,c,{headers:i,withCredentials:true})}getTeamsFromUberlandia(){let e={first:20,after:"",q:"",filtering:[{field:"location",value:"aWQ6MzA2NjM=",compare:"id"},{field:"event",value:"2025 NASA Space Apps Challenge",compare:"in"}]};return this.getTeams1(e)}static \u0275fac=function(t){return new(t||a)};static \u0275prov=k({token:a,factory:a.\u0275fac,providedIn:"root"})};export{g};